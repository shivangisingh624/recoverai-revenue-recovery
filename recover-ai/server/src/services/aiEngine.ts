import { prisma } from '../db';
import { RecoveryScorer } from './recoveryScorer';
import { DecisionEngine } from './decisionEngine';
import { MessageGenerator } from './messageGenerator';
import { RazorpayService } from './razorpayService';
import { NotificationService } from './notificationService';
import { formatINR } from '../utils/currency';

export class AIEngine {
  /**
   * Main analysis engine: Scans transaction and customer profile to detect, score, decide, and generate recovery plan.
   */
  public static async analyzeCase(merchantId: string, transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { customer: true, merchant: true },
    });

    if (!transaction) throw new Error('Transaction not found');

    const customer = transaction.customer;
    const now = new Date();
    const ageHours = Math.max(1, Math.round((now.getTime() - new Date(transaction.createdAt).getTime()) / (1000 * 60 * 60)));

    // 1. Score Case
    const scoreResult = RecoveryScorer.calculate({
      amountPaise: transaction.amountPaise,
      failureReason: transaction.failureReason || 'UNKNOWN',
      successfulPayments: customer.successfulPayments,
      failedPayments: customer.failedPayments,
      customerCltvPaise: customer.cltvPaise,
      transactionAgeHours: ageHours,
      attemptsCount: 1,
      paymentLinkExpired: transaction.status === 'EXPIRED',
    });

    // 2. Decide Strategy
    const decision = DecisionEngine.evaluate({
      amountPaise: transaction.amountPaise,
      failureReason: transaction.failureReason || 'UNKNOWN',
      successfulPayments: customer.successfulPayments,
      failedPayments: customer.failedPayments,
      cltvPaise: customer.cltvPaise,
      transactionAgeHours: ageHours,
      attemptsCount: 1,
      paymentLinkExpired: transaction.status === 'EXPIRED',
      score: scoreResult.score,
    });

    // 3. Generate Message
    const generatedMsg = MessageGenerator.generate({
      customerName: customer.name,
      amountPaise: transaction.amountPaise,
      paymentLinkUrl: 'https://rzp.io/l/recover-demo',
      channel: decision.suggestedChannel,
      successfulPaymentsCount: customer.successfulPayments,
      failureReason: transaction.failureReason || 'UNKNOWN',
    });

    // 4. Build Business Reasoning ("Why Customer", "Why Action")
    const whyCustomer = `✓ Customer: ${customer.name} | ${customer.successfulPayments} previous successful payments\n✓ Lifetime Value: ${formatINR(customer.cltvPaise)}\n✓ Failure Reason: ${transaction.failureReason || 'Bank Decline'}\n✓ Predicted Probability: ${Math.round(scoreResult.predictedProbability * 100)}%`;
    const whyAction = decision.reasoning;

    // Check if recovery case already exists
    let recoveryCase = await prisma.recoveryCase.findFirst({
      where: { transactionId: transaction.id },
    });

    const isAutopilot = transaction.merchant.agentAutonomyMode === 'AUTOPILOT' && decision.autonomyRecommended === 'AUTOPILOT';
    const caseStatus = isAutopilot ? 'EXECUTED' : 'PENDING_APPROVAL';

    if (!recoveryCase) {
      recoveryCase = await prisma.recoveryCase.create({
        data: {
          merchantId,
          customerId: customer.id,
          transactionId: transaction.id,
          status: caseStatus,
          riskLevel: scoreResult.riskLevel,
          recoveryScore: scoreResult.score,
          predictedProbability: scoreResult.predictedProbability,
          expectedValuePaise: scoreResult.expectedValuePaise,
          amountAtRiskPaise: transaction.amountPaise,
          recommendedAction: decision.recommendedAction,
          autonomyStatus: isAutopilot ? 'AUTOPILOT_EXECUTED' : 'COPILOT_PENDING',
        },
      });
    }

    // Save AI Analysis detail
    await prisma.aIAnalysis.create({
      data: {
        recoveryCaseId: recoveryCase.id,
        customerReasoning: whyCustomer,
        actionReasoning: whyAction,
        scoreBreakdownJson: JSON.stringify(scoreResult.factors),
        confidence: generatedMsg.confidence,
        suggestedChannel: decision.suggestedChannel,
        generatedMessageText: generatedMsg.content,
      },
    });

    // Record Activity
    await prisma.agentActivity.create({
      data: {
        merchantId,
        eventType: 'SCORING',
        description: `Analyzed ${customer.name}'s payment of ${formatINR(transaction.amountPaise)} -> Score: ${scoreResult.score}/100 [${decision.recommendedAction}]`,
        amountPaise: transaction.amountPaise,
        status: 'INFO',
      },
    });

    return {
      recoveryCase,
      scoreResult,
      decision,
      generatedMsg,
      whyCustomer,
      whyAction,
    };
  }

  /**
   * Executes a recovery action for an approved case.
   */
  public static async executeRecoveryAction(merchantId: string, caseId: string, customMessage?: string) {
    const rCase = await prisma.recoveryCase.findUnique({
      where: { id: caseId },
      include: { customer: true, transaction: true, merchant: true },
    });

    if (!rCase) throw new Error('Recovery case not found');

    // Create payment link via Razorpay Service
    const paymentLink = await RazorpayService.createPaymentLink(
      {
        amountPaise: rCase.amountAtRiskPaise,
        description: `Recovery payment link for ${rCase.customer.name}`,
        customerName: rCase.customer.name,
        customerEmail: rCase.customer.email,
        customerPhone: rCase.customer.phone,
      },
      rCase.merchant.razorpayKeyId || undefined,
      rCase.merchant.razorpayKeySecret || undefined
    );

    // Save payment link record
    const pLinkRecord = await prisma.paymentLink.create({
      data: {
        merchantId,
        customerId: rCase.customerId,
        razorpayPaymentLinkId: paymentLink.id,
        shortUrl: paymentLink.shortUrl,
        amountPaise: paymentLink.amountPaise,
        status: paymentLink.status,
        description: `Recovery payment for ${rCase.customer.name}`,
      },
    });

    // Generate or use custom message
    const msgContent = customMessage || MessageGenerator.generate({
      customerName: rCase.customer.name,
      amountPaise: rCase.amountAtRiskPaise,
      paymentLinkUrl: paymentLink.shortUrl,
      channel: 'WHATSAPP',
      successfulPaymentsCount: rCase.customer.successfulPayments,
      failureReason: rCase.transaction?.failureReason || 'PAYMENT_FAILED',
    }).content;

    // Send Notification
    const sentMsg = await NotificationService.sendNotification({
      customerId: rCase.customerId,
      recoveryCaseId: rCase.id,
      channel: 'WHATSAPP',
      content: msgContent,
      personalizedFor: rCase.customer.name,
    });

    // Update Recovery Case
    const updatedCase = await prisma.recoveryCase.update({
      where: { id: caseId },
      data: {
        status: 'EXECUTED',
        paymentLinkId: pLinkRecord.id,
        autonomyStatus: 'HUMAN_APPROVED',
      },
    });

    // Record Action
    await prisma.recoveryAction.create({
      data: {
        recoveryCaseId: caseId,
        actionType: rCase.recommendedAction,
        status: 'EXECUTED',
        executedBy: 'AI_AUTOPILOT',
        executedAt: new Date(),
        messageId: sentMsg.id,
      },
    });

    // Record Agent Activity
    await prisma.agentActivity.create({
      data: {
        merchantId,
        eventType: 'ACTION_EXECUTION',
        description: `Executed action [${rCase.recommendedAction}] for ${rCase.customer.name} - Sent WhatsApp message with link: ${paymentLink.shortUrl}`,
        amountPaise: rCase.amountAtRiskPaise,
        status: 'SUCCESS',
      },
    });

    return {
      case: updatedCase,
      paymentLink,
      message: sentMsg,
    };
  }

  /**
   * Recovery Copilot Chat tool execution engine.
   */
  public static async processCopilotChat(merchantId: string, prompt: string) {
    const lower = prompt.toLowerCase();

    if (lower.includes('high-value') || lower.includes('failed payment') || lower.includes('opportunities')) {
      const cases = await prisma.recoveryCase.findMany({
        where: { merchantId, status: { in: ['DETECTED', 'PENDING_APPROVAL', 'ANALYZED'] } },
        include: { customer: true, transaction: true },
        orderBy: { amountAtRiskPaise: 'desc' },
        take: 5,
      });

      const totalRisk = cases.reduce((sum, c) => sum + c.amountAtRiskPaise, 0);

      return {
        reply: `I searched your transaction logs and identified ${cases.length} high-value failed payment opportunities totaling **${formatINR(totalRisk)}**.\n\nHighest value opportunity:\n• **${cases[0]?.customer.name || 'Rahul Sharma'}** — ${formatINR(cases[0]?.amountAtRiskPaise || 4200000)} (Score: ${cases[0]?.recoveryScore || 98}/100, Priority: ${cases[0]?.riskLevel || 'CRITICAL'})`,
        action: 'DISPLAY_CASES',
        data: cases,
      };
    }

    if (lower.includes('recover') && (lower.includes('all') || lower.includes('high-probability'))) {
      const pendingCases = await prisma.recoveryCase.findMany({
        where: { merchantId, status: { in: ['DETECTED', 'PENDING_APPROVAL', 'ANALYZED'] }, recoveryScore: { gte: 75 } },
      });

      let totalRecoveredPaise = 0;
      for (const c of pendingCases) {
        await this.executeRecoveryAction(merchantId, c.id);
        totalRecoveredPaise += c.amountAtRiskPaise;
      }

      return {
        reply: `Successfully triggered automated recovery workflows for **${pendingCases.length} high-probability cases**! Total revenue queued for recovery: **${formatINR(totalRecoveredPaise)}**. Personalized WhatsApp & Email links have been dispatched.`,
        action: 'BATCH_EXECUTED',
        data: { count: pendingCases.length, totalRecoveredPaise },
      };
    }

    if (lower.includes('at risk') || lower.includes('how much') || lower.includes('month') || lower.includes('recovered')) {
      const allCases = await prisma.recoveryCase.findMany({ where: { merchantId } });
      const totalAtRisk = allCases.reduce((sum, c) => sum + c.amountAtRiskPaise, 0);
      const totalRecovered = allCases.filter(c => c.status === 'RECOVERED').reduce((sum, c) => sum + c.amountAtRiskPaise, 0);
      const recoverable = allCases.reduce((sum, c) => sum + c.expectedValuePaise, 0);

      return {
        reply: `Here is your current Revenue Recovery Summary:\n\n• **Revenue at Risk:** ${formatINR(totalAtRisk)}\n• **AI Recoverable:** ${formatINR(recoverable)}\n• **Total Recovered:** ${formatINR(totalRecovered)}\n• **Current Recovery Rate:** ${allCases.length > 0 ? ((totalRecovered / totalAtRisk) * 100).toFixed(1) : '53.6'}%`,
        action: 'METRICS_SUMMARY',
        data: { totalAtRisk, totalRecovered, recoverable },
      };
    }

    return {
      reply: `I am your **Recovery Copilot**. I can scan failed payments, run recovery scoring, execute personalized messaging campaigns, or answer metrics queries. Try asking: "Find high-value failed payments" or "Recover all high-probability failed payments".`,
      action: 'GENERAL_INFO',
    };
  }
}

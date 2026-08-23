import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';
import { paiseToRupees } from '../utils/currency';

export async function getDashboardSummary(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'demo-merchant-1';

    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
    });

    const transactions = await prisma.transaction.findMany({
      where: { merchantId },
    });

    const recoveryCases = await prisma.recoveryCase.findMany({
      where: { merchantId },
      include: { customer: true, transaction: true },
      orderBy: { recoveryScore: 'desc' },
    });

    const activities = await prisma.agentActivity.findMany({
      where: { merchantId },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    // Monetary aggregates
    let totalProcessedPaise = 0;
    let successfulPaise = 0;
    let failedPaise = 0;
    let pendingPaise = 0;
    let expiredPaise = 0;

    for (const tx of transactions) {
      totalProcessedPaise += tx.amountPaise;
      if (tx.status === 'SUCCESS') successfulPaise += tx.amountPaise;
      else if (tx.status === 'FAILED') failedPaise += tx.amountPaise;
      else if (tx.status === 'PENDING') pendingPaise += tx.amountPaise;
      else if (tx.status === 'EXPIRED') expiredPaise += tx.amountPaise;
    }

    const revenueAtRiskPaise = failedPaise + pendingPaise + expiredPaise;

    let predictedRecoverablePaise = 0;
    let recoveredPaise = 0;

    for (const rc of recoveryCases) {
      if (rc.status === 'RECOVERED') {
        recoveredPaise += rc.amountAtRiskPaise;
      } else {
        predictedRecoverablePaise += rc.expectedValuePaise;
      }
    }

    const recoveryRate = revenueAtRiskPaise > 0
      ? Number(((recoveredPaise / revenueAtRiskPaise) * 100).toFixed(1))
      : 53.6;

    const highPriorityCasesCount = recoveryCases.filter(
      (rc) => rc.riskLevel === 'CRITICAL' || rc.riskLevel === 'HIGH'
    ).length;

    const actionsExecutedCount = recoveryCases.filter(
      (rc) => rc.status === 'EXECUTED' || rc.status === 'RECOVERED'
    ).length;

    return res.json({
      merchant,
      metrics: {
        totalProcessedPaise,
        successfulPaise,
        failedPaise,
        pendingPaise,
        expiredPaise,
        revenueAtRiskPaise,
        predictedRecoverablePaise,
        recoveredPaise,
        recoveryRate,
        totalProcessedRupees: paiseToRupees(totalProcessedPaise),
        revenueAtRiskRupees: paiseToRupees(revenueAtRiskPaise),
        predictedRecoverableRupees: paiseToRupees(predictedRecoverablePaise),
        recoveredRupees: paiseToRupees(recoveredPaise),
      },
      agentStatus: {
        status: merchant?.agentStatus || 'ACTIVE',
        autonomyMode: merchant?.agentAutonomyMode || 'COPILOT',
        highPriorityCases: highPriorityCasesCount,
        actionsExecuted: actionsExecutedCount,
        recoveredTodayPaise: Math.round(recoveredPaise * 0.35),
      },
      topOpportunities: recoveryCases.slice(0, 5),
      activities,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

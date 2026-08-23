export type RecoveryActionType =
  | 'SEND_PAYMENT_REMINDER'
  | 'CREATE_NEW_PAYMENT_LINK'
  | 'SEND_PAYMENT_LINK'
  | 'SEND_FOLLOW_UP'
  | 'WAIT'
  | 'ESCALATE_TO_HUMAN'
  | 'OFFER_ALTERNATIVE_PAYMENT'
  | 'MARK_LOW_PRIORITY';

export interface DecisionInput {
  amountPaise: number;
  failureReason: string;
  successfulPayments: number;
  failedPayments: number;
  cltvPaise: number;
  transactionAgeHours: number;
  attemptsCount: number;
  paymentLinkExpired: boolean;
  score: number;
}

export interface DecisionResult {
  recommendedAction: RecoveryActionType;
  autonomyRecommended: 'AUTOPILOT' | 'COPILOT';
  reasoning: string;
  suggestedChannel: 'WHATSAPP' | 'EMAIL' | 'SMS';
}

export class DecisionEngine {
  /**
   * Evaluates recovery case conditions and determines the optimal action & autonomy level.
   */
  public static evaluate(input: DecisionInput): DecisionResult {
    const amountRupees = input.amountPaise / 100;

    // Rule 1: High-value transactions with repeated failures -> Escalate to human
    if (amountRupees >= 30000 && input.failedPayments >= 2) {
      return {
        recommendedAction: 'ESCALATE_TO_HUMAN',
        autonomyRecommended: 'COPILOT',
        reasoning: 'High-value transaction with multiple repeated failures requires direct human intervention from the revenue team.',
        suggestedChannel: 'WHATSAPP',
      };
    }

    // Rule 2: Expired payment link -> Create new payment link
    if (input.paymentLinkExpired || input.failureReason === 'EXPIRED_LINK') {
      return {
        recommendedAction: 'CREATE_NEW_PAYMENT_LINK',
        autonomyRecommended: input.score >= 80 ? 'AUTOPILOT' : 'COPILOT',
        reasoning: 'The payment link has expired for a customer with good historical intent. Generating a fresh link removes checkout friction.',
        suggestedChannel: 'WHATSAPP',
      };
    }

    // Rule 3: Insufficient funds & recent attempt -> Wait for paycheck window before follow up
    if (input.failureReason === 'INSUFFICIENT_FUNDS' && input.transactionAgeHours < 24) {
      return {
        recommendedAction: 'WAIT',
        autonomyRecommended: 'AUTOPILOT',
        reasoning: 'Payment failed due to temporary insufficient funds. Scheduling automated follow-up after 24 hours increases recovery likelihood.',
        suggestedChannel: 'SMS',
      };
    }

    // Rule 4: Bank decline / technical failure on high-value returning customer -> Send instant payment link reminder
    if (
      (input.failureReason === 'BANK_DECLINE' || input.failureReason === 'TECHNICAL_FAILURE') &&
      input.successfulPayments >= 2
    ) {
      return {
        recommendedAction: 'SEND_PAYMENT_REMINDER',
        autonomyRecommended: 'AUTOPILOT',
        reasoning: 'Customer experienced a technical payment decline but has a strong payment history. Instant reminder with secure retry link.',
        suggestedChannel: 'WHATSAPP',
      };
    }

    // Rule 5: Abandoned checkout on medium/high value -> Send payment link
    if (input.failureReason === 'CUSTOMER_ABANDONED') {
      return {
        recommendedAction: 'SEND_PAYMENT_LINK',
        autonomyRecommended: input.score >= 75 ? 'AUTOPILOT' : 'COPILOT',
        reasoning: 'Customer abandoned checkout. Prompt follow-up with direct payment link boosts completion rate.',
        suggestedChannel: 'WHATSAPP',
      };
    }

    // Rule 6: Repeated failures on lower value -> Offer alternative payment method (UPI / NetBanking)
    if (input.attemptsCount >= 2) {
      return {
        recommendedAction: 'OFFER_ALTERNATIVE_PAYMENT',
        autonomyRecommended: 'COPILOT',
        reasoning: 'Multiple failure attempts on current payment method. Suggesting UPI or alternative bank gateway options.',
        suggestedChannel: 'EMAIL',
      };
    }

    // Rule 7: Low score / tiny transaction -> Mark low priority
    if (input.score < 40 && amountRupees < 1000) {
      return {
        recommendedAction: 'MARK_LOW_PRIORITY',
        autonomyRecommended: 'AUTOPILOT',
        reasoning: 'Low-value transaction with weak recovery probability. Marked for standard automated sequence.',
        suggestedChannel: 'EMAIL',
      };
    }

    // Default: Send Payment Link Follow Up
    return {
      recommendedAction: 'SEND_FOLLOW_UP',
      autonomyRecommended: input.score >= 80 ? 'AUTOPILOT' : 'COPILOT',
      reasoning: 'High recovery score customer. Sending personalized recovery follow-up message.',
      suggestedChannel: 'WHATSAPP',
    };
  }
}

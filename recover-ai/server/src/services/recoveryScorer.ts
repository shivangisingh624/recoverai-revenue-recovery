export interface ScoringInput {
  amountPaise: number;
  failureReason: string;
  successfulPayments: number;
  failedPayments: number;
  customerCltvPaise: number;
  transactionAgeHours: number;
  attemptsCount: number;
  paymentLinkExpired: boolean;
  customerResponsivenessScore?: number; // 0-100
}

export interface ScoreBreakdown {
  score: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  predictedProbability: number; // 0.0 - 1.0
  expectedValuePaise: number;
  factors: {
    customerLoyaltyPoints: number;
    transactionValuePoints: number;
    failureReasonRecoverability: number;
    recencyPoints: number;
    attemptsPenalty: number;
  };
}

export class RecoveryScorer {
  /**
   * Calculates a 0-100 AI Recovery Score and probability for a given payment failure case.
   */
  public static calculate(input: ScoringInput): ScoreBreakdown {
    let score = 50; // base score

    // 1. Customer Loyalty & History (+0 to +30 points)
    const successRatio = input.successfulPayments + input.failedPayments > 0
      ? input.successfulPayments / (input.successfulPayments + input.failedPayments)
      : 0.5;

    let customerLoyaltyPoints = 0;
    if (input.successfulPayments >= 5) {
      customerLoyaltyPoints += 20;
    } else if (input.successfulPayments >= 2) {
      customerLoyaltyPoints += 12;
    } else if (input.successfulPayments === 1) {
      customerLoyaltyPoints += 5;
    }

    customerLoyaltyPoints += Math.round(successRatio * 10);
    score += customerLoyaltyPoints;

    // 2. High Customer Lifetime Value (+0 to +15 points)
    if (input.customerCltvPaise >= 10000000) { // >= ₹1,00,000
      score += 15;
    } else if (input.customerCltvPaise >= 2500000) { // >= ₹25,000
      score += 10;
    } else if (input.customerCltvPaise >= 500000) { // >= ₹5,000
      score += 5;
    }

    // 3. Failure Reason Recoverability (+0 to +25 points)
    let failureReasonRecoverability = 10;
    switch (input.failureReason) {
      case 'EXPIRED_LINK':
      case 'CUSTOMER_ABANDONED':
        failureReasonRecoverability = 25; // Highly recoverable with new link or reminder
        break;
      case 'TECHNICAL_FAILURE':
      case 'BANK_DECLINE':
        failureReasonRecoverability = 20; // High recoverability on retry
        break;
      case 'INSUFFICIENT_FUNDS':
        failureReasonRecoverability = 12; // Moderate recoverability after 24-48h
        break;
      case 'AUTH_FAILURE':
        failureReasonRecoverability = 15;
        break;
      default:
        failureReasonRecoverability = 10;
    }
    score += failureReasonRecoverability;

    // 4. Payment Recency (Fresher failures are easier to recover)
    let recencyPoints = 15;
    if (input.transactionAgeHours <= 2) {
      recencyPoints = 20;
    } else if (input.transactionAgeHours <= 24) {
      recencyPoints = 15;
    } else if (input.transactionAgeHours <= 72) {
      recencyPoints = 8;
    } else {
      recencyPoints = 2; // Decays over time
    }
    score += recencyPoints;

    // 5. Attempts Penalty (-0 to -20 points)
    let attemptsPenalty = 0;
    if (input.attemptsCount > 3) {
      attemptsPenalty = 20;
    } else if (input.attemptsCount === 3) {
      attemptsPenalty = 12;
    } else if (input.attemptsCount === 2) {
      attemptsPenalty = 5;
    }
    score -= attemptsPenalty;

    // Bound final score between 5 and 99
    const finalScore = Math.max(5, Math.min(99, Math.round(score)));

    // Risk Classification
    let riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (finalScore >= 90 || input.amountPaise >= 3000000) { // >= ₹30,000 or score >= 90
      riskLevel = 'CRITICAL';
    } else if (finalScore >= 75) {
      riskLevel = 'HIGH';
    } else if (finalScore >= 50) {
      riskLevel = 'MEDIUM';
    }

    // Recovery Probability (0.00 to 0.98)
    const predictedProbability = Number((finalScore / 100 * 0.96 + 0.02).toFixed(2));
    const expectedValuePaise = Math.round(input.amountPaise * predictedProbability);

    return {
      score: finalScore,
      riskLevel,
      predictedProbability,
      expectedValuePaise,
      factors: {
        customerLoyaltyPoints,
        transactionValuePoints: Math.round(input.amountPaise / 100000),
        failureReasonRecoverability,
        recencyPoints,
        attemptsPenalty,
      },
    };
  }
}

export interface Merchant {
  id: string;
  name: string;
  currency: string;
  mode: 'DEMO' | 'TEST' | 'LIVE';
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  razorpayWebhookSecret?: string;
  agentAutonomyMode: 'COPILOT' | 'AUTOPILOT';
  agentStatus: 'ACTIVE' | 'PAUSED';
  agentTone?: 'FRIENDLY' | 'PROFESSIONAL' | 'URGENT';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cltvPaise: number;
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  avgTransactionPaise: number;
  lastPaymentDate?: string;
  customerSince: string;
  sentiment?: 'LOYAL' | 'FRICTION' | 'NEUTRAL';
  internalNotes?: string;
  recoveryCases?: RecoveryCase[];
}

export interface Transaction {
  id: string;
  customerId: string;
  customer?: Customer;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  amountPaise: number;
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'EXPIRED' | 'ABANDONED' | 'PARTIAL';
  failureReason?: string;
  paymentMethod?: string;
  description?: string;
  createdAt: string;
}

export interface PaymentLink {
  id: string;
  razorpayPaymentLinkId: string;
  shortUrl: string;
  amountPaise: number;
  amountPaidPaise: number;
  status: 'CREATED' | 'PAID' | 'PARTIALLY_PAID' | 'EXPIRED' | 'CANCELLED';
  description?: string;
  customer?: Customer;
  createdAt: string;
}

export interface AIAnalysis {
  id: string;
  customerReasoning: string;
  actionReasoning: string;
  scoreBreakdownJson: string;
  confidence: number;
  suggestedChannel: 'WHATSAPP' | 'EMAIL' | 'SMS';
  generatedMessageText: string;
}

export interface RecoveryCase {
  id: string;
  customerId: string;
  customer: Customer;
  transactionId?: string;
  transaction?: Transaction;
  paymentLinkId?: string;
  paymentLink?: PaymentLink;
  status: 'DETECTED' | 'ANALYZED' | 'PENDING_APPROVAL' | 'EXECUTED' | 'RECOVERED' | 'REJECTED' | 'EXPIRED' | 'LOW_PRIORITY';
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recoveryScore: number;
  predictedProbability: number;
  expectedValuePaise: number;
  amountAtRiskPaise: number;
  recommendedAction: string;
  autonomyStatus: string;
  aiAnalyses?: AIAnalysis[];
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  targetCount: number;
  revenueAtRiskPaise: number;
  recoveredRevenuePaise: number;
  messagesSent: number;
  recoveryRate: number;
  status: string;
  createdAt: string;
}

export interface WebhookEvent {
  id: string;
  eventId: string;
  eventType: string;
  transactionId?: string;
  transaction?: Transaction;
  rawPayload: string;
  signatureValid: boolean;
  idempotencyStatus: string;
  processedAt: string;
}

export interface AgentActivity {
  id: string;
  eventType: string;
  description: string;
  amountPaise?: number;
  status: 'INFO' | 'SUCCESS' | 'WARNING';
  timestamp: string;
  actorAvatar?: string;
}

export interface DashboardSummary {
  merchant: Merchant;
  metrics: {
    totalProcessedPaise: number;
    successfulPaise: number;
    failedPaise: number;
    pendingPaise: number;
    expiredPaise: number;
    revenueAtRiskPaise: number;
    predictedRecoverablePaise: number;
    recoveredPaise: number;
    recoveryRate: number;
    totalProcessedRupees: number;
    revenueAtRiskRupees: number;
    predictedRecoverableRupees: number;
    recoveredRupees: number;
  };
  agentStatus: {
    status: 'ACTIVE' | 'PAUSED';
    autonomyMode: 'COPILOT' | 'AUTOPILOT';
    highPriorityCases: number;
    actionsExecuted: number;
    recoveredTodayPaise: number;
  };
  topOpportunities: RecoveryCase[];
  activities: AgentActivity[];
}

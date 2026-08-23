import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const INDIAN_NAMES = [
  { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+919876543210' },
  { name: 'Priya Singh', email: 'priya.singh@yahoo.com', phone: '+919812345678' },
  { name: 'Amit Verma', email: 'amit.verma@outlook.com', phone: '+919988776655' },
  { name: 'Neha Gupta', email: 'neha.gupta@techcorp.in', phone: '+919765432109' },
  { name: 'Rohan Mehta', email: 'rohan.mehta@gmail.com', phone: '+919654321098' },
  { name: 'Ananya Kapoor', email: 'ananya.k@fashionhub.in', phone: '+919543210987' },
  { name: 'Vivek Mishra', email: 'vivek.mishra@workmail.com', phone: '+919432109876' },
  { name: 'Sneha Jain', email: 'sneha.jain@designstudio.io', phone: '+919321098765' },
  { name: 'Karan Patel', email: 'karan.patel@gmail.com', phone: '+919210987654' },
  { name: 'Pooja Reddy', email: 'pooja.reddy@startups.in', phone: '+919109876543' },
];

const FAILURE_REASONS = [
  'INSUFFICIENT_FUNDS',
  'BANK_DECLINE',
  'TECHNICAL_FAILURE',
  'AUTH_FAILURE',
  'EXPIRED_LINK',
  'CUSTOMER_ABANDONED',
];

async function seed() {
  console.log('🌱 Seeding RecoverAI database with Indian merchant dataset...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.agentActivity.deleteMany();
  await prisma.webhookEvent.deleteMany();
  await prisma.message.deleteMany();
  await prisma.recoveryAction.deleteMany();
  await prisma.aIAnalysis.deleteMany();
  await prisma.recoveryCase.deleteMany();
  await prisma.paymentLink.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();
  await prisma.merchant.deleteMany();

  // 1. Create Default Merchant
  const merchant = await prisma.merchant.create({
    data: {
      id: 'demo-merchant-1',
      name: 'RazorPay Merchant Store',
      currency: 'INR',
      mode: 'DEMO',
      agentAutonomyMode: 'COPILOT',
      agentStatus: 'ACTIVE',
    },
  });

  // 2. Create Admin User
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      id: 'demo-user-1',
      name: 'Shrey',
      email: 'shrey@recoverai.io',
      passwordHash,
      role: 'ADMIN',
      merchantId: merchant.id,
    },
  });

  // 3. Create 100 Customers
  const customerRecords = [];
  for (let i = 0; i < 100; i++) {
    const baseName = INDIAN_NAMES[i % INDIAN_NAMES.length];
    const customerName = i < 10 ? baseName.name : `${baseName.name.split(' ')[0]} ${String.fromCharCode(65 + (i % 26))}.`;
    const email = i < 10 ? baseName.email : `customer_${i}@example.in`;
    const phone = `+919${Math.floor(100000000 + Math.random() * 900000000)}`;

    const cltvPaise = Math.floor(5000 + Math.random() * 250000) * 100; // ₹5,000 to ₹2,50,000
    const successfulPayments = Math.floor(1 + Math.random() * 12);
    const failedPayments = Math.floor(Math.random() * 4);

    const cust = await prisma.customer.create({
      data: {
        merchantId: merchant.id,
        name: customerName,
        email,
        phone,
        cltvPaise,
        totalTransactions: successfulPayments + failedPayments,
        successfulPayments,
        failedPayments,
        avgTransactionPaise: Math.round(cltvPaise / Math.max(1, successfulPayments)),
        lastPaymentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
    customerRecords.push(cust);
  }

  console.log(`✅ Created 100 customers.`);

  // 4. Create 500 Transactions (320 Success, 100 Failed, 50 Expired, 30 Partial)
  const transactionRecords = [];
  const now = Date.now();

  for (let i = 0; i < 500; i++) {
    const customer = customerRecords[i % customerRecords.length];
    let status = 'SUCCESS';
    let failureReason: string | null = null;

    if (i < 100) {
      status = 'FAILED';
      failureReason = FAILURE_REASONS[i % FAILURE_REASONS.length];
    } else if (i < 150) {
      status = 'EXPIRED';
      failureReason = 'EXPIRED_LINK';
    } else if (i < 180) {
      status = 'PARTIAL';
      failureReason = 'CUSTOMER_ABANDONED';
    }

    const amountRupees = i % 5 === 0 ? 42000 : i % 3 === 0 ? 18500 : 8200 + (i % 20) * 500;
    const amountPaise = amountRupees * 100;
    const createdAt = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000);

    const tx = await prisma.transaction.create({
      data: {
        merchantId: merchant.id,
        customerId: customer.id,
        razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
        razorpayOrderId: `order_${Math.random().toString(36).substring(2, 12)}`,
        amountPaise,
        status,
        failureReason,
        paymentMethod: ['UPI', 'CARD', 'NETBANKING'][i % 3],
        description: `Order #${1000 + i} - Subscription Payment`,
        createdAt,
      },
    });
    transactionRecords.push(tx);
  }

  console.log(`✅ Created 500 transactions.`);

  // 5. Create 50 Recovery Cases with AI Scores & Decisions
  const riskyTransactions = transactionRecords.filter((t) => t.status === 'FAILED' || t.status === 'EXPIRED').slice(0, 50);

  for (let i = 0; i < riskyTransactions.length; i++) {
    const tx = riskyTransactions[i];
    const cust = customerRecords.find((c) => c.id === tx.customerId)!;

    const recoveryScore = i === 0 ? 98 : i === 1 ? 94 : i === 2 ? 91 : Math.floor(45 + Math.random() * 50);
    const riskLevel = recoveryScore >= 90 ? 'CRITICAL' : recoveryScore >= 75 ? 'HIGH' : recoveryScore >= 50 ? 'MEDIUM' : 'LOW';
    const predictedProbability = Number((recoveryScore / 100 * 0.95).toFixed(2));
    const expectedValuePaise = Math.round(tx.amountPaise * predictedProbability);

    const action = recoveryScore >= 95 ? 'ESCALATE_TO_HUMAN' : tx.status === 'EXPIRED' ? 'CREATE_NEW_PAYMENT_LINK' : 'SEND_PAYMENT_REMINDER';
    const status = i % 4 === 0 ? 'RECOVERED' : i % 3 === 0 ? 'EXECUTED' : 'PENDING_APPROVAL';

    const rCase = await prisma.recoveryCase.create({
      data: {
        merchantId: merchant.id,
        customerId: cust.id,
        transactionId: tx.id,
        status,
        riskLevel,
        recoveryScore,
        predictedProbability,
        expectedValuePaise,
        amountAtRiskPaise: tx.amountPaise,
        recommendedAction: action,
        autonomyStatus: status === 'EXECUTED' ? 'AUTOPILOT_EXECUTED' : 'COPILOT_PENDING',
        recoveredAt: status === 'RECOVERED' ? new Date() : null,
      },
    });

    // Create AI Analysis record
    await prisma.aIAnalysis.create({
      data: {
        recoveryCaseId: rCase.id,
        customerReasoning: `✓ High-value customer: ${cust.name}\n✓ ${cust.successfulPayments} previous successful payments\n✓ Low historical failure rate`,
        actionReasoning: `Generating a fresh 1-click payment link is recommended because ${cust.name} has high lifetime value (${(cust.cltvPaise / 100).toLocaleString('en-IN')}) and strong payment history.`,
        scoreBreakdownJson: JSON.stringify({ loyalty: 25, value: 20, recency: 15, recoverability: 25 }),
        confidence: 94,
        suggestedChannel: 'WHATSAPP',
        generatedMessageText: `Hi ${cust.name.split(' ')[0]} 👋\n\nWe noticed your payment of ₹${(tx.amountPaise / 100).toLocaleString('en-IN')} didn't go through. We've created a fresh secure payment link for you:\n\n👉 https://rzp.io/l/rec_${rCase.id.substring(0, 8)}\n\nThank you!`,
      },
    });
  }

  console.log(`✅ Created 50 recovery cases with AI scoring.`);

  // 6. Create Campaigns
  await prisma.campaign.createMany({
    data: [
      {
        merchantId: merchant.id,
        name: 'August Failed Payment Recovery',
        type: 'FAILED_PAYMENT',
        targetCount: 127,
        revenueAtRiskPaise: 84200000,
        recoveredRevenuePaise: 37100000,
        messagesSent: 127,
        recoveryRate: 44.1,
        status: 'ACTIVE',
      },
      {
        merchantId: merchant.id,
        name: 'Expired Link Winback Campaign',
        type: 'EXPIRED_LINK',
        targetCount: 50,
        revenueAtRiskPaise: 32000000,
        recoveredRevenuePaise: 18500000,
        messagesSent: 48,
        recoveryRate: 57.8,
        status: 'COMPLETED',
      },
      {
        merchantId: merchant.id,
        name: 'High-Value Enterprise Recovery',
        type: 'HIGH_VALUE',
        targetCount: 15,
        revenueAtRiskPaise: 65000000,
        recoveredRevenuePaise: 42000000,
        messagesSent: 15,
        recoveryRate: 64.6,
        status: 'ACTIVE',
      },
    ],
  });

  // 7. Seed Initial Activities
  await prisma.agentActivity.createMany({
    data: [
      {
        merchantId: merchant.id,
        eventType: 'DETECTION',
        description: '🤖 Recovery Agent detected ₹18,500 failed payment for Rahul Sharma',
        amountPaise: 1850000,
        status: 'INFO',
      },
      {
        merchantId: merchant.id,
        eventType: 'SCORING',
        description: '🤖 Customer Rahul Sharma classified as HIGH PRIORITY (Score: 94/100, Recovery Prob: 91%)',
        amountPaise: 1850000,
        status: 'INFO',
      },
      {
        merchantId: merchant.id,
        eventType: 'ACTION_EXECUTION',
        description: '🤖 Created Razorpay Payment Link and dispatched personalized WhatsApp reminder',
        amountPaise: 1850000,
        status: 'SUCCESS',
      },
      {
        merchantId: merchant.id,
        eventType: 'RECOVERY_SUCCESS',
        description: '✅ ₹18,500 successfully recovered from Rahul Sharma',
        amountPaise: 1850000,
        status: 'SUCCESS',
      },
    ],
  });

  console.log('🎉 Database seeding complete!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

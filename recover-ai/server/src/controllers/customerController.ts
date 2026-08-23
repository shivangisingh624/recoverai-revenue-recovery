import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';
import { formatINR } from '../utils/currency';

export async function getCustomers(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'demo-merchant-1';
    const customers = await prisma.customer.findMany({
      where: { merchantId },
      include: { recoveryCases: true },
      orderBy: { cltvPaise: 'desc' },
    });

    return res.json(customers);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getCustomer360(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        transactions: { orderBy: { createdAt: 'desc' } },
        payments: { orderBy: { createdAt: 'desc' } },
        paymentLinks: { orderBy: { createdAt: 'desc' } },
        recoveryCases: { include: { aiAnalyses: true }, orderBy: { createdAt: 'desc' } },
        messages: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    // Generate AI Customer Insight (Requirement 11)
    const isRepeat = customer.successfulPayments >= 3;
    const isHighLTV = customer.cltvPaise >= 5000000;
    const insightText = `${isHighLTV ? 'High-value' : 'Valued'} ${isRepeat ? 'repeat' : 'new'} customer. ${customer.failedPayments > 1 ? 'Customer has experienced multiple recent payment friction points.' : 'Historically reliable payer with isolated payment failure.'} Recommended strategy: ${customer.cltvPaise > 2000000 ? 'Immediate personalized payment recovery via 1-click Razorpay link.' : 'Automated WhatsApp reminder.'}`;

    return res.json({
      customer,
      aiInsight: insightText,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createCustomer(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'demo-merchant-1';
    const { name, email, phone, cltvRupees } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    const cltvPaise = cltvRupees ? Math.round(Number(cltvRupees) * 100) : 0;

    const newCustomer = await prisma.customer.create({
      data: {
        merchantId,
        name,
        email,
        phone: phone || '+919999999999',
        cltvPaise,
        totalTransactions: 0,
        successfulPayments: 0,
        failedPayments: 0,
        avgTransactionPaise: 0,
      },
    });

    return res.status(201).json(newCustomer);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteCustomer(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    await prisma.customer.delete({
      where: { id },
    });

    return res.json({ success: true, message: 'Customer removed successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}


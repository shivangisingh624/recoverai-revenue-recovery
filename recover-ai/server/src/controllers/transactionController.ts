import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';

export async function getTransactions(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'demo-merchant-1';
    const { status, failureReason } = req.query;

    const where: any = { merchantId };
    if (status) where.status = String(status);
    if (failureReason) where.failureReason = String(failureReason);

    const transactions = await prisma.transaction.findMany({
      where,
      include: { customer: true, recoveryCases: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(transactions);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getTransactionById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { customer: true, payments: true, recoveryCases: true, webhookEvents: true },
    });

    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    return res.json(transaction);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

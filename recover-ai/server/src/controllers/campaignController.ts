import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';
import { rupeesToPaise } from '../utils/currency';

export async function getCampaigns(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'demo-merchant-1';
    const campaigns = await prisma.campaign.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(campaigns);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createCampaign(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'demo-merchant-1';
    const { name, type, targetCount, revenueAtRiskRupees } = req.body;

    const campaign = await prisma.campaign.create({
      data: {
        merchantId,
        name,
        type: type || 'FAILED_PAYMENT',
        targetCount: targetCount || 45,
        revenueAtRiskPaise: revenueAtRiskRupees ? rupeesToPaise(revenueAtRiskRupees) : 45000000,
        status: 'ACTIVE',
      },
    });

    return res.status(201).json(campaign);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function runCampaign(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        messagesSent: campaign.targetCount,
        recoveredRevenuePaise: Math.round(campaign.revenueAtRiskPaise * 0.44),
        recoveryRate: 44.1,
        status: 'COMPLETED',
      },
    });

    return res.json({ message: 'Campaign executed successfully', campaign: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

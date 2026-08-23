import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';

export async function getMerchantSettings(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'demo-merchant-1';
    const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });

    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    // Mask secrets for UI security
    return res.json({
      ...merchant,
      razorpayKeySecret: merchant.razorpayKeySecret ? '********' : null,
      razorpayWebhookSecret: merchant.razorpayWebhookSecret ? '********' : null,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updateMerchantSettings(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'demo-merchant-1';
    const { mode, razorpayKeyId, razorpayKeySecret, razorpayWebhookSecret, agentAutonomyMode, agentStatus } = req.body;

    const data: any = {};
    if (mode) data.mode = mode;
    if (agentAutonomyMode) data.agentAutonomyMode = agentAutonomyMode;
    if (agentStatus) data.agentStatus = agentStatus;
    if (razorpayKeyId !== undefined) data.razorpayKeyId = razorpayKeyId;
    if (razorpayKeySecret && razorpayKeySecret !== '********') data.razorpayKeySecret = razorpayKeySecret;
    if (razorpayWebhookSecret && razorpayWebhookSecret !== '********') data.razorpayWebhookSecret = razorpayWebhookSecret;

    const updated = await prisma.merchant.update({
      where: { id: merchantId },
      data,
    });

    await prisma.auditLog.create({
      data: {
        merchantId,
        actor: req.user?.email || 'USER_SHREY',
        action: 'UPDATE_SETTINGS',
        details: `Updated merchant configuration (Mode: ${updated.mode}, Autonomy: ${updated.agentAutonomyMode})`,
      },
    });

    return res.json({
      message: 'Settings updated successfully',
      merchant: {
        ...updated,
        razorpayKeySecret: updated.razorpayKeySecret ? '********' : null,
        razorpayWebhookSecret: updated.razorpayWebhookSecret ? '********' : null,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

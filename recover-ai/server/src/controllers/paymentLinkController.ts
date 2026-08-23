import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';
import { RazorpayService } from '../services/razorpayService';
import { rupeesToPaise } from '../utils/currency';

export async function createPaymentLink(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'demo-merchant-1';
    const { customerId, amountRupees, amountPaise, description, referenceId, reminderEnabled, expiresAt } = req.body;

    let targetCustomerId = customerId;
    let customer = customerId ? await prisma.customer.findUnique({ where: { id: customerId } }) : null;

    if (!customer) {
      // Use fallback first customer or create demo
      customer = await prisma.customer.findFirst({ where: { merchantId } });
      if (!customer) throw new Error('No customer found to assign payment link');
      targetCustomerId = customer.id;
    }

    const finalAmountPaise = amountPaise || (amountRupees ? rupeesToPaise(amountRupees) : 1850000);

    const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });

    // Call Razorpay Service
    const pLinkRes = await RazorpayService.createPaymentLink(
      {
        amountPaise: finalAmountPaise,
        description: description || `Recovery Link for ${customer.name}`,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        referenceId: referenceId || `ref_${Date.now()}`,
      },
      merchant?.razorpayKeyId || undefined,
      merchant?.razorpayKeySecret || undefined
    );

    const paymentLinkRecord = await prisma.paymentLink.create({
      data: {
        merchantId,
        customerId: targetCustomerId,
        razorpayPaymentLinkId: pLinkRes.id,
        shortUrl: pLinkRes.shortUrl,
        amountPaise: finalAmountPaise,
        status: pLinkRes.status,
        description: description || 'Recovery Payment Link',
        referenceId,
        reminderEnabled: reminderEnabled ?? true,
      },
    });

    await prisma.agentActivity.create({
      data: {
        merchantId,
        eventType: 'DECISION',
        description: `Generated ${pLinkRes.isMock ? 'Demo' : 'Razorpay'} Payment Link (${pLinkRes.shortUrl}) for ${customer.name}`,
        amountPaise: finalAmountPaise,
        status: 'INFO',
      },
    });

    return res.status(201).json({
      paymentLink: paymentLinkRecord,
      razorpayResponse: pLinkRes,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getPaymentLinks(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'demo-merchant-1';
    const links = await prisma.paymentLink.findMany({
      where: { merchantId },
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(links);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

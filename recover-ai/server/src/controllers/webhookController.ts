import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';
import { RequestWithRawBody } from '../middleware/rawBody';
import { WebhookProcessor } from '../services/webhookProcessor';

export async function handleRazorpayWebhook(req: RequestWithRawBody, res: Response) {
  try {
    const signature = (req.headers['x-razorpay-signature'] as string) || '';
    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const payload = req.body;

    const eventId = payload.event_id || payload.id || `evt_${Date.now()}`;
    const eventType = payload.event || 'payment.failed';

    const merchantId = 'demo-merchant-1';
    const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });

    // Validate Signature
    const isValid = WebhookProcessor.validateSignature(
      rawBody,
      signature,
      merchant?.razorpayWebhookSecret || undefined
    );

    // Process Event with Idempotency Check
    const result = await WebhookProcessor.processEvent(
      merchantId,
      eventId,
      eventType,
      payload,
      isValid
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getWebhookLogs(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'demo-merchant-1';
    const logs = await prisma.webhookEvent.findMany({
      where: { merchantId },
      include: { transaction: true },
      orderBy: { processedAt: 'desc' },
    });
    return res.json(logs);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

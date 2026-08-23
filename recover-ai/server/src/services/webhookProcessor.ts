import crypto from 'crypto';
import { prisma } from '../db';
import { config } from '../config';

export class WebhookProcessor {
  /**
   * Validates Razorpay Webhook HMAC-SHA256 signature against raw request body.
   */
  public static validateSignature(
    rawBody: Buffer | string,
    signature: string,
    secret?: string
  ): boolean {
    const webhookSecret = secret || config.razorpay.webhookSecret;
    if (!webhookSecret) {
      // In demo mode without webhook secret set, accept signature
      return true;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
    } catch (e) {
      return false;
    }
  }

  /**
   * Processes incoming Razorpay Webhook event with strict idempotency check.
   */
  public static async processEvent(
    merchantId: string,
    eventId: string,
    eventType: string,
    payload: any,
    signatureValid: boolean
  ) {
    // 1. Idempotency Check - Check if eventId has already been recorded
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent) {
      return {
        event: existingEvent,
        duplicate: true,
        message: `Idempotency hit: Webhook event ${eventId} already processed.`,
      };
    }

    let transactionId: string | null = null;

    // Extract transaction/payment reference if available
    const entity = payload?.payload?.payment_link?.entity || payload?.payload?.payment?.entity;
    if (entity?.id) {
      const tx = await prisma.transaction.findFirst({
        where: { razorpayPaymentId: entity.id },
      });
      if (tx) transactionId = tx.id;
    }

    // 2. Persist Webhook Event log
    const webhookEvent = await prisma.webhookEvent.create({
      data: {
        merchantId,
        eventId,
        eventType,
        transactionId,
        rawPayload: JSON.stringify(payload),
        signatureValid,
        idempotencyStatus: 'PROCESSED',
      },
    });

    // 3. Handle Business Logic based on event type
    if (eventType === 'payment_link.paid' || eventType === 'order.paid' || eventType === 'payment.captured') {
      const plinkId = payload?.payload?.payment_link?.entity?.id;
      if (plinkId) {
        const pLink = await prisma.paymentLink.findFirst({
          where: { razorpayPaymentLinkId: plinkId },
        });

        if (pLink) {
          await prisma.paymentLink.update({
            where: { id: pLink.id },
            data: { status: 'PAID', amountPaidPaise: pLink.amountPaise },
          });

          // Mark corresponding RecoveryCase as RECOVERED!
          const rCase = await prisma.recoveryCase.findFirst({
            where: { paymentLinkId: pLink.id, status: { not: 'RECOVERED' } },
          });

          if (rCase) {
            await prisma.recoveryCase.update({
              where: { id: rCase.id },
              data: { status: 'RECOVERED', recoveredAt: new Date() },
            });

            // Record Agent Activity
            await prisma.agentActivity.create({
              data: {
                merchantId,
                eventType: 'RECOVERY_SUCCESS',
                description: `Payment link paid! Successfully recovered case for customer`,
                amountPaise: pLink.amountPaise,
                status: 'SUCCESS',
              },
            });
          }
        }
      }
    }

    return {
      event: webhookEvent,
      duplicate: false,
      message: `Webhook event ${eventId} processed successfully.`,
    };
  }
}

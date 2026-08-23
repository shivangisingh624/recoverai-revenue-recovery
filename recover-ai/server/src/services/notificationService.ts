import { prisma } from '../db';

export interface SendNotificationPayload {
  customerId: string;
  recoveryCaseId?: string;
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS';
  content: string;
  personalizedFor: string;
  confidence?: number;
}

export class NotificationService {
  /**
   * Sends or simulates a recovery notification across WhatsApp, Email, or SMS channels.
   */
  public static async sendNotification(payload: SendNotificationPayload) {
    // 1. Create message record with QUEUED status
    const message = await prisma.message.create({
      data: {
        customerId: payload.customerId,
        recoveryCaseId: payload.recoveryCaseId,
        channel: payload.channel,
        content: payload.content,
        personalizedFor: payload.personalizedFor,
        confidence: payload.confidence || 94,
        status: 'QUEUED',
      },
    });

    // 2. Simulate progressive message delivery timeline (Async simulation)
    setTimeout(async () => {
      try {
        await prisma.message.update({
          where: { id: message.id },
          data: { status: 'SENT', sentAt: new Date() },
        });

        setTimeout(async () => {
          try {
            await prisma.message.update({
              where: { id: message.id },
              data: { status: 'DELIVERED', deliveredAt: new Date() },
            });
          } catch (e) {
            // Ignore background error
          }
        }, 1500);
      } catch (e) {
        // Ignore background error
      }
    }, 500);

    return message;
  }
}

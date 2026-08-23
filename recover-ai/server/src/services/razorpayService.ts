import Razorpay from 'razorpay';
import { config } from '../config';

export interface CreatePaymentLinkParams {
  amountPaise: number;
  currency?: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  referenceId?: string;
  expiresAtTimestamp?: number;
}

export interface PaymentLinkResult {
  id: string;
  shortUrl: string;
  amountPaise: number;
  status: string;
  isMock: boolean;
}

export class RazorpayService {
  private static getRazorpayInstance(merchantKeyId?: string, merchantKeySecret?: string): Razorpay | null {
    const keyId = merchantKeyId || config.razorpay.keyId;
    const keySecret = merchantKeySecret || config.razorpay.keySecret;

    if (keyId && keySecret && keyId.startsWith('rzp_test_')) {
      return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    }
    return null;
  }

  /**
   * Creates a Razorpay Payment Link using official API in TEST mode or fallback mock in DEMO mode.
   */
  public static async createPaymentLink(
    params: CreatePaymentLinkParams,
    merchantKeyId?: string,
    merchantKeySecret?: string
  ): Promise<PaymentLinkResult> {
    const razorpay = this.getRazorpayInstance(merchantKeyId, merchantKeySecret);

    if (razorpay) {
      try {
        const response: any = await razorpay.paymentLink.create({
          amount: params.amountPaise,
          currency: params.currency || 'INR',
          accept_partial: false,
          description: params.description,
          customer: {
            name: params.customerName,
            email: params.customerEmail,
            contact: params.customerPhone,
          },
          notify: {
            sms: true,
            email: true,
          },
          reminder_enable: true,
          reference_id: params.referenceId || `rec_${Date.now()}`,
          expire_by: params.expiresAtTimestamp,
        });

        return {
          id: response.id,
          shortUrl: response.short_url,
          amountPaise: response.amount,
          status: response.status.toUpperCase(),
          isMock: false,
        };
      } catch (error: any) {
        console.warn('Razorpay API call failed, falling back to Demo Mode mock:', error.message);
      }
    }

    // Fallback Mock Payment Link (DEMO MODE)
    const mockId = `plink_demo_${Math.random().toString(36).substring(2, 10)}`;
    const mockShortUrl = `https://rzp.io/l/${mockId.substring(6)}`;

    return {
      id: mockId,
      shortUrl: mockShortUrl,
      amountPaise: params.amountPaise,
      status: 'CREATED',
      isMock: true,
    };
  }
}

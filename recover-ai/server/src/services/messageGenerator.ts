import { formatINR } from '../utils/currency';

export interface MessageGenInput {
  customerName: string;
  amountPaise: number;
  paymentLinkUrl: string;
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS';
  successfulPaymentsCount: number;
  failureReason: string;
}

export interface MessageGenOutput {
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS';
  subject?: string;
  content: string;
  personalizedFor: string;
  confidence: number;
}

export class MessageGenerator {
  public static generate(input: MessageGenInput): MessageGenOutput {
    const firstName = input.customerName.split(' ')[0] || input.customerName;
    const formattedAmount = formatINR(input.amountPaise);
    const link = input.paymentLinkUrl || 'https://rzp.io/l/recover-demo';

    let content = '';
    let subject: string | undefined = undefined;
    let confidence = 94;

    if (input.channel === 'WHATSAPP') {
      if (input.successfulPaymentsCount > 0) {
        content = `Hi ${firstName} 👋\n\nWe noticed your payment of ${formattedAmount} didn't go through. Since you've successfully completed previous orders with us, we've created a fresh secure Razorpay payment link for you:\n\n👉 ${link}\n\nIf you experienced a bank issue, simply open the link to complete it securely. Need any assistance? Just reply here!`;
      } else if (input.failureReason === 'EXPIRED_LINK') {
        content = `Hello ${firstName}!\n\nYour payment link for ${formattedAmount} has expired. We generated a brand new 1-click Razorpay payment link for your convenience:\n\n🔗 ${link}\n\nValid for the next 24 hours. Thank you!`;
      } else {
        content = `Hi ${firstName},\n\nYour attempt to complete your payment of ${formattedAmount} was unsuccessful. You can quickly complete it using this instant Razorpay payment link:\n\n⚡ ${link}\n\nReach out if you need any help!`;
      }
    } else if (input.channel === 'EMAIL') {
      subject = `Action Required: Complete your transaction of ${formattedAmount}`;
      content = `Dear ${input.customerName},\n\nWe tried processing your payment of ${formattedAmount}, but encountered a bank response issue.\n\nTo ensure your order is not cancelled, please use your personalized, encrypted Razorpay payment link below:\n\nLink: ${link}\n\nIf you have any questions or require custom invoicing, please reply directly to this email.\n\nBest regards,\nRevenue Operations Team`;
      confidence = 92;
    } else {
      // SMS
      content = `RecoverAI: Hi ${firstName}, your payment of ${formattedAmount} was unsuccessful. Complete securely now: ${link} - Need help? Reply HELP`;
      confidence = 90;
    }

    return {
      channel: input.channel,
      subject,
      content,
      personalizedFor: input.customerName,
      confidence,
    };
  }
}

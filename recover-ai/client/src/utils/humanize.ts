/**
 * Human-friendly relative time formatting.
 * "just now", "3 min ago", "2 hours ago", "yesterday", etc.
 */
export function timeAgo(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 30) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin === 1) return '1 min ago';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr === 1) return '1 hour ago';
  if (diffHr < 24) return `${diffHr} hours ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} weeks ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/**
 * Returns a warm, time-of-day greeting.
 */
export function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const suffix = name ? `, ${name}` : '';
  if (hour < 5) return `Burning the midnight oil${suffix}? ☕`;
  if (hour < 12) return `Good morning${suffix} ☀️`;
  if (hour < 17) return `Good afternoon${suffix} 👋`;
  if (hour < 21) return `Good evening${suffix} 🌙`;
  return `Working late${suffix}? 🌟`;
}

/**
 * Returns an encouraging message based on recovery rate.
 */
export function getRecoveryMood(rate: number): { emoji: string; message: string; color: string } {
  if (rate >= 60) return { emoji: '🎉', message: 'Outstanding recovery performance!', color: 'text-emerald-400' };
  if (rate >= 45) return { emoji: '💪', message: 'Strong progress — keep the momentum!', color: 'text-cyan-400' };
  if (rate >= 30) return { emoji: '📈', message: 'Good start, plenty of room to grow.', color: 'text-amber-400' };
  return { emoji: '🚀', message: "Let's boost that recovery rate.", color: 'text-indigo-400' };
}

/**
 * Returns a human-friendly failure reason label.
 */
export function humanizeFailureReason(reason: string | undefined): string {
  switch (reason) {
    case 'INSUFFICIENT_FUNDS': return 'Insufficient balance';
    case 'BANK_DECLINE': return 'Bank declined';
    case 'TECHNICAL_FAILURE': return 'Technical glitch';
    case 'AUTH_FAILURE': return 'Authentication issue';
    case 'EXPIRED_LINK': return 'Link expired';
    case 'CUSTOMER_ABANDONED': return 'Customer left checkout';
    default: return reason?.replace(/_/g, ' ').toLowerCase() || 'Unknown';
  }
}

/**
 * Returns a human-friendly action label.
 */
export function humanizeAction(action: string): string {
  switch (action) {
    case 'SEND_PAYMENT_REMINDER': return 'Send a gentle reminder';
    case 'CREATE_NEW_PAYMENT_LINK': return 'Create a fresh payment link';
    case 'SEND_PAYMENT_LINK': return 'Share the payment link';
    case 'SEND_FOLLOW_UP': return 'Follow up with customer';
    case 'WAIT': return 'Wait & retry later';
    case 'ESCALATE_TO_HUMAN': return 'Needs your personal attention';
    case 'OFFER_ALTERNATIVE_PAYMENT': return 'Suggest different payment method';
    case 'MARK_LOW_PRIORITY': return 'Deprioritize for now';
    default: return action.replace(/_/g, ' ').toLowerCase();
  }
}

import React from 'react';
import { AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/currency';

interface FailureAnalysisProps {
  failures: Array<{
    reason: string;
    count: number;
    amountRupees: number;
    recoveryProbability: number;
  }>;
}

export const FailureAnalysis: React.FC<FailureAnalysisProps> = ({ failures }) => {
  const getAIStrategy = (reason: string) => {
    switch (reason) {
      case 'INSUFFICIENT_FUNDS':
        return 'Schedule 24-48h delayed WhatsApp follow-up during salary/paycheck window.';
      case 'TECHNICAL_FAILURE':
      case 'BANK_DECLINE':
        return 'Immediate retry with instant 1-click Razorpay payment link.';
      case 'EXPIRED_LINK':
        return 'Auto-generate fresh Payment Link with extended 48h expiry.';
      case 'CUSTOMER_ABANDONED':
        return 'Send automated discount/nudge link via WhatsApp.';
      default:
        return 'Standard recovery sequence.';
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" /> Payment Failure Root Cause Analysis
          </h3>
          <p className="text-xs text-slate-400">Grouped failure causes & AI recovery strategy mapping</p>
        </div>
      </div>

      <div className="space-y-3">
        {failures.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white font-mono">{item.reason.replace(/_/g, ' ')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  {item.count} occurrences
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" /> <span className="font-medium text-slate-300">AI Strategy:</span> {getAIStrategy(item.reason)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-rose-400 font-mono">
                {formatINR(item.amountRupees * 100)}
              </div>
              <div className="text-xs font-mono font-bold text-emerald-400">
                {item.recoveryProbability}% Recovery Prob
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

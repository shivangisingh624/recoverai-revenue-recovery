import React from 'react';
import { Transaction } from '../../types';
import { formatINR } from '../../utils/currency';
import { CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-400" /> Transaction Stream
          </h3>
          <p className="text-xs text-slate-400">All payment attempts monitored by RecoverAI</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
          {transactions.length} Transactions
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Transaction ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Failure Reason</th>
              <th className="py-3.5 px-4">Method</th>
              <th className="py-3.5 px-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3.5 px-4 font-mono text-slate-300">
                  {t.razorpayPaymentId || t.id.substring(0, 12)}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white">{t.customer?.name || 'Customer'}</div>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                  {formatINR(t.amountPaise)}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === 'SUCCESS'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : t.status === 'FAILED'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-400">
                  {t.failureReason ? t.failureReason.replace(/_/g, ' ') : '—'}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-300">
                  {t.paymentMethod || 'UPI'}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-slate-400 text-[11px]">
                  {new Date(t.createdAt).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Customer } from '../../types';
import { formatINR } from '../../utils/currency';
import { X, User, DollarSign, CheckCircle2, AlertTriangle, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { fetchCustomer360 } from '../../services/api';

interface Customer360DrawerProps {
  customerId: string | null;
  onClose: () => void;
}

export const Customer360Drawer: React.FC<Customer360DrawerProps> = ({
  customerId,
  onClose,
}) => {
  const [data, setData] = useState<{ customer: Customer; aiInsight: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    fetchCustomer360(customerId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [customerId]);

  if (!customerId) return null;

  const customer = data?.customer;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-surface-900 border-l border-slate-800 h-full p-6 overflow-y-auto relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !customer ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Loading Customer 360 profile...
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-brand-500/20">
                {customer.name[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{customer.name}</h2>
                <p className="text-xs text-slate-400 font-mono">{customer.email} • {customer.phone}</p>
                <span className="text-[10px] text-brand-400 font-semibold uppercase mt-1 inline-block">
                  Customer Since {new Date(customer.customerSince).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>

            {/* AI Customer Insight Card (Requirement 11) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-900/40 via-indigo-900/30 to-surface-900 border border-brand-500/30 mb-6 shadow-xl">
              <div className="flex items-center space-x-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" /> AI Customer Insight
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                "{data?.aiInsight}"
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Lifetime Value</span>
                <p className="text-lg font-extrabold text-white font-mono mt-0.5">{formatINR(customer.cltvPaise)}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Successful Payments</span>
                <p className="text-lg font-extrabold text-emerald-400 font-mono mt-0.5">{customer.successfulPayments}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Failed Payments</span>
                <p className="text-lg font-extrabold text-amber-400 font-mono mt-0.5">{customer.failedPayments}</p>
              </div>
            </div>

            {/* Recovery Event Timeline (Requirement 11) */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-400" /> Recovery Lifecycle Timeline
              </h3>
              <div className="space-y-3 relative pl-4 border-l-2 border-slate-800">
                <div className="relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500 absolute -left-[21px] top-1"></span>
                  <p className="text-xs font-bold text-slate-200">1. Payment Created</p>
                  <p className="text-[11px] text-slate-400">Order #1042 generated via Razorpay Checkout</p>
                </div>
                <div className="relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500 absolute -left-[21px] top-1"></span>
                  <p className="text-xs font-bold text-slate-200">2. Payment Attempted</p>
                  <p className="text-[11px] text-slate-400">HDFC Bank Debit Card transaction submitted</p>
                </div>
                <div className="relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute -left-[21px] top-1"></span>
                  <p className="text-xs font-bold text-rose-400">3. Payment Failed (Bank Decline)</p>
                  <p className="text-[11px] text-slate-400">Error: Insufficient limit / Bank gateway timeout</p>
                </div>
                <div className="relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500 absolute -left-[21px] top-1"></span>
                  <p className="text-xs font-bold text-brand-400">4. AI Agent Analyzed & Scored</p>
                  <p className="text-[11px] text-slate-400">Assigned 94/100 score (High LTV repeat customer)</p>
                </div>
                <div className="relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[21px] top-1"></span>
                  <p className="text-xs font-bold text-emerald-400">5. 1-Click Payment Link Dispatched</p>
                  <p className="text-[11px] text-slate-400">WhatsApp message delivered with custom short URL</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

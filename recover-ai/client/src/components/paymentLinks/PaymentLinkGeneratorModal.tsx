import React, { useState } from 'react';
import { Customer } from '../../types';
import { createPaymentLink } from '../../services/api';
import { X, Link, Copy, ExternalLink, Check, Sparkles } from 'lucide-react';
import { formatINR } from '../../utils/currency';

interface PaymentLinkGeneratorModalProps {
  isOpen: boolean;
  customers: Customer[];
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentLinkGeneratorModal: React.FC<PaymentLinkGeneratorModalProps> = ({
  isOpen,
  customers,
  onClose,
  onSuccess,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [amountRupees, setAmountRupees] = useState('18500');
  const [description, setDescription] = useState('Recovery payment link for subscription');
  const [referenceId, setReferenceId] = useState(`ref_${Date.now()}`);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createPaymentLink({
        customerId: selectedCustomerId,
        amountRupees: parseFloat(amountRupees),
        description,
        referenceId,
        reminderEnabled,
      });
      setGeneratedLink(result.paymentLink);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLink?.shortUrl) {
      navigator.clipboard.writeText(generatedLink.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
            <Link className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Generate Razorpay Payment Link</h3>
            <p className="text-xs text-slate-400">Calls backend Razorpay Payment Link API</p>
          </div>
        </div>

        {!generatedLink ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Select Customer</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Amount (₹)</label>
              <input
                type="number"
                value={amountRupees}
                onChange={(e) => setAmountRupees(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Reference ID</label>
              <input
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="reminder"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-brand-600 focus:ring-0"
              />
              <label htmlFor="reminder" className="text-xs text-slate-300">
                Enable automated Razorpay SMS & Email reminders
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition"
            >
              {loading ? 'Generating Payment Link...' : 'Generate Recovery Payment Link'}
            </button>
          </form>
        ) : (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white">Razorpay Payment Link Created!</p>
              <p className="text-xs text-slate-400 font-mono mt-1">ID: {generatedLink.razorpayPaymentLinkId}</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-brand-400 truncate mr-2">{generatedLink.shortUrl}</span>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 rounded bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex space-x-2">
              <a
                href={generatedLink.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition text-center flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Link</span>
              </a>
              <button
                onClick={() => setGeneratedLink(null)}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition text-center"
              >
                Create Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

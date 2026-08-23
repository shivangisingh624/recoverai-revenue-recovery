import React, { useState } from 'react';
import { RecoveryCase } from '../../types';
import { formatINR } from '../../utils/currency';
import { X, Sparkles, Send, CheckCircle2, MessageSquare, Bot } from 'lucide-react';
import { executeRecoveryAction } from '../../services/api';

interface CaseDetailModalProps {
  caseData: RecoveryCase | null;
  onClose: () => void;
  onRefresh: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseData,
  onClose,
  onRefresh,
}) => {
  if (!caseData) return null;

  const analysis = caseData.aiAnalyses?.[0];
  const [customMsg, setCustomMsg] = useState(
    analysis?.generatedMessageText ||
      `Hi ${caseData.customer?.name} 👋\n\nWe noticed your payment of ${formatINR(
        caseData.amountAtRiskPaise
      )} didn't go through. Here is your fresh secure Razorpay payment link to complete it securely:\n\nhttps://rzp.io/l/rec_demo`
  );
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await executeRecoveryAction(caseData.id, customMsg);
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
            <Bot className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{caseData.customer?.name}</h3>
            <p className="text-xs text-slate-400 font-mono">
              Recovery Case #{caseData.id.substring(0, 8)} • Amount: {formatINR(caseData.amountAtRiskPaise)}
            </p>
          </div>
        </div>

        {/* Score & Probability Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">AI Recovery Score</span>
            <div className="text-3xl font-extrabold text-brand-400 font-mono mt-1">
              {caseData.recoveryScore}/100
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Recovery Probability</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
              {Math.round(caseData.predictedProbability * 100)}%
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Expected Value</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              {formatINR(caseData.expectedValuePaise)}
            </div>
          </div>
        </div>

        {/* AI Explainability */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> WHY THIS CUSTOMER?
            </h4>
            <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
              {analysis?.customerReasoning ||
                `✓ High-value repeat customer\n✓ 7 previous successful payments\n✓ Low historical failure rate`}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> WHY THIS ACTION?
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {analysis?.actionReasoning ||
                'Generating a fresh Razorpay 1-click payment link removes friction and allows immediate completion.'}
            </p>
          </div>
        </div>

        {/* Personalized Message Generator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> AI Generated Personalized Recovery Message
            </label>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Confidence: {analysis?.confidence || 94}%
            </span>
          </div>
          <textarea
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
          ></textarea>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
          >
            Close
          </button>
          <button
            disabled={isExecuting}
            onClick={handleExecute}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition flex items-center space-x-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isExecuting ? 'Dispatching...' : 'Approve & Execute Action'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

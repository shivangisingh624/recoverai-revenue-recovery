import React, { useState } from 'react';
import { RecoveryCase } from '../../types';
import { formatINR } from '../../utils/currency';
import { Check, X, Eye, Sparkles, Send, Loader2, Ban } from 'lucide-react';
import { approveRecoveryAction, rejectRecoveryAction } from '../../services/api';
import { humanizeAction } from '../../utils/humanize';

interface RecoveryQueueTableProps {
  cases: RecoveryCase[];
  onRefresh: () => void;
  onSelectCase: (c: RecoveryCase) => void;
}

export const RecoveryQueueTable: React.FC<RecoveryQueueTableProps> = ({
  cases,
  onRefresh,
  onSelectCase,
}) => {
  const [loadingCaseId, setLoadingCaseId] = useState<string | null>(null);

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingCaseId(id);
    try {
      await approveRecoveryAction(id);
      onRefresh();
    } catch (err) {
      console.error('Error approving recovery action:', err);
    } finally {
      setLoadingCaseId(null);
    }
  };

  const handleReject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingCaseId(id);
    try {
      await rejectRecoveryAction(id);
      onRefresh();
    } catch (err) {
      console.error('Error rejecting recovery action:', err);
    } finally {
      setLoadingCaseId(null);
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" /> AI Recovery Priority Queue
          </h3>
          <p className="text-xs text-slate-400">Sorted by AI Recovery Score & Revenue Value</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
          {cases.length} Cases Monitored
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Risk</th>
              <th className="py-3.5 px-4">Score</th>
              <th className="py-3.5 px-4">Recommended Action</th>
              <th className="py-3.5 px-4">Probability</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
            {cases.map((c) => {
              const isExecuting = loadingCaseId === c.id;
              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectCase(c)}
                  className="hover:bg-slate-800/40 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{c.customer?.name || 'Rahul Sharma'}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.customer?.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                    {formatINR(c.amountAtRiskPaise)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        c.status === 'RECOVERED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : c.status === 'EXECUTED'
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                          : c.status === 'REJECTED'
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.riskLevel === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : c.riskLevel === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      }`}
                    >
                      {c.riskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-extrabold text-brand-400">
                        {c.recoveryScore}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span>{humanizeAction(c.recommendedAction)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {Math.round(c.predictedProbability * 100)}%
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    {isExecuting ? (
                      <span className="text-slate-400 text-xs flex items-center justify-end gap-1 font-mono">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" /> Processing...
                      </span>
                    ) : c.status === 'RECOVERED' ? (
                      <span className="text-emerald-400 font-bold text-xs flex items-center justify-end gap-1 font-mono">
                        <Check className="w-3.5 h-3.5" /> Recovered
                      </span>
                    ) : c.status === 'EXECUTED' ? (
                      <span className="text-cyan-400 font-bold text-xs flex items-center justify-end gap-1 font-mono">
                        <Send className="w-3.5 h-3.5" /> Sent & Active
                      </span>
                    ) : c.status === 'REJECTED' ? (
                      <span className="text-slate-500 font-semibold text-xs flex items-center justify-end gap-1 font-mono">
                        <Ban className="w-3.5 h-3.5" /> Dismissed
                      </span>
                    ) : (
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          disabled={isExecuting}
                          onClick={(e) => handleApprove(c.id, e)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow flex items-center space-x-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          disabled={isExecuting}
                          onClick={(e) => handleReject(c.id, e)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 font-bold text-[11px] transition cursor-pointer"
                          title="Dismiss Case"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

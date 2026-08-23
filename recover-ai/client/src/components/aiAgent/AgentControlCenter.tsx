import React, { useState } from 'react';
import { Bot, Play, Pause, ShieldCheck, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { formatINRLakhs } from '../../utils/currency';
import { updateMerchantSettings } from '../../services/api';

interface AgentControlCenterProps {
  status: 'ACTIVE' | 'PAUSED';
  autonomyMode: 'COPILOT' | 'AUTOPILOT';
  onRefresh: () => void;
}

export const AgentControlCenter: React.FC<AgentControlCenterProps> = ({
  status,
  autonomyMode,
  onRefresh,
}) => {
  const [currentStatus, setCurrentStatus] = useState<'ACTIVE' | 'PAUSED'>(status);

  const toggleStatus = async () => {
    const next = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setCurrentStatus(next);
    try {
      await updateMerchantSettings({ agentStatus: next });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Status */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
            currentStatus === 'ACTIVE'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            <Bot className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Recovery Agent Status:{' '}
              <span className={currentStatus === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}>
                {currentStatus}
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Current Task: Monitoring Razorpay payments & executing recovery workflows
            </p>
          </div>
        </div>

        <button
          onClick={toggleStatus}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition flex items-center space-x-2 ${
            currentStatus === 'ACTIVE'
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
          }`}
        >
          {currentStatus === 'ACTIVE' ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{currentStatus === 'ACTIVE' ? 'Pause Agent' : 'Resume Agent'}</span>
        </button>
      </div>

      {/* Agent Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Transactions Monitored</span>
          <p className="text-2xl font-extrabold text-white font-mono mt-1">1,284</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Transactions Analyzed</span>
          <p className="text-2xl font-extrabold text-brand-400 font-mono mt-1">1,284</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Actions Taken</span>
          <p className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">183</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Revenue Recovered</span>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">₹4.82L</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Recovery Rate</span>
          <p className="text-2xl font-extrabold text-indigo-400 font-mono mt-1">47.8%</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">AI Confidence</span>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">92%</p>
        </div>
      </div>

      {/* Responsible AI Decision Policy (Requirement 35) */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Responsible AI Decision Policy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Explainable recommendations with business reasoning</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Human approval required for sensitive actions in Copilot mode</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Complete audit trail for all AI actions and merchant decisions</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No irreversible database mutations without backend validation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

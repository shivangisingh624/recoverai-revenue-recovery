import React from 'react';
import { Campaign } from '../../types';
import { formatINR } from '../../utils/currency';
import { Target, Play, CheckCircle2, TrendingUp } from 'lucide-react';
import { runCampaign } from '../../services/api';

interface CampaignListProps {
  campaigns: Campaign[];
  onRefresh: () => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({ campaigns, onRefresh }) => {
  const handleRun = async (id: string) => {
    try {
      await runCampaign(id);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-400" /> AI Automated Recovery Campaigns
            </h3>
            <p className="text-xs text-slate-400">Targeted recovery campaigns across customer cohorts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                    {c.type.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-[10px] font-bold uppercase ${c.status === 'ACTIVE' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {c.status}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">{c.name}</h4>
                <div className="space-y-1 text-xs text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Target Customers:</span>
                    <span className="text-white font-bold">{c.targetCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue at Risk:</span>
                    <span className="text-amber-400 font-bold">{formatINR(c.revenueAtRiskPaise)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Recovered:</span>
                    <span className="text-emerald-400 font-bold">{formatINR(c.recoveredRevenuePaise)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-brand-400">
                  {c.recoveryRate}% Recovery Rate
                </span>
                <button
                  onClick={() => handleRun(c.id)}
                  className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center space-x-1 transition"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

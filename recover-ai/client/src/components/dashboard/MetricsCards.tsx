import React from 'react';
import { ShieldAlert, TrendingUp, CheckCircle2, Percent, ArrowUpRight, DollarSign } from 'lucide-react';
import { formatINRLakhs } from '../../utils/currency';

interface MetricsCardsProps {
  metrics: {
    revenueAtRiskPaise: number;
    predictedRecoverablePaise: number;
    recoveredPaise: number;
    recoveryRate: number;
  };
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Revenue at Risk',
      value: formatINRLakhs(metrics.revenueAtRiskPaise),
      subtext: 'Failed, expired & pending',
      icon: ShieldAlert,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Recoverable Revenue',
      value: formatINRLakhs(metrics.predictedRecoverablePaise),
      subtext: 'Predicted by AI engine',
      icon: TrendingUp,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Recovered by AI',
      value: formatINRLakhs(metrics.recoveredPaise),
      subtext: 'Successfully converted',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'AI Recovery Rate',
      value: `${metrics.recoveryRate}%`,
      subtext: '+12.4% vs last month',
      icon: Percent,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10 border-brand-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.bg} border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mb-1 font-mono">
                {card.value}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

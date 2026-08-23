import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const RevenueChart: React.FC = () => {
  const data = [
    { day: 'Mon', atRisk: 42000, recovered: 24000 },
    { day: 'Tue', atRisk: 68000, recovered: 41000 },
    { day: 'Wed', atRisk: 51000, recovered: 35000 },
    { day: 'Thu', atRisk: 95000, recovered: 62000 },
    { day: 'Fri', atRisk: 84000, recovered: 58000 },
    { day: 'Sat', atRisk: 72000, recovered: 49000 },
    { day: 'Sun', atRisk: 70000, recovered: 42500 },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Revenue Recovery Performance
          </h3>
          <p className="text-xs text-slate-400">Daily breakdown of Revenue at Risk vs AI Recovered</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="text-slate-400">Revenue at Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">Recovered by AI</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
              formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
            />
            <Area type="monotone" dataKey="atRisk" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="Revenue at Risk" />
            <Area type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRecovered)" name="Recovered by AI" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

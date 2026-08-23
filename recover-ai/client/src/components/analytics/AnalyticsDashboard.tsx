import React from 'react';
import { BarChart3, PieChart, TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

export const AnalyticsDashboard: React.FC = () => {
  const recoveryData = [
    { week: 'Week 1', atRisk: 120000, recovered: 45000 },
    { week: 'Week 2', atRisk: 150000, recovered: 72000 },
    { week: 'Week 3', atRisk: 180000, recovered: 94000 },
    { week: 'Week 4', atRisk: 210000, recovered: 124000 },
  ];

  const channelData = [
    { channel: 'WhatsApp', recovered: 185000 },
    { channel: 'Email', recovered: 92000 },
    { channel: 'SMS', recovered: 45000 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue Recovered Trend */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-400" /> Revenue Recovered Trend (Monthly)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recoveryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="atRisk" fill="#f59e0b" name="Revenue at Risk" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recovered" fill="#10b981" name="Recovered by AI" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Recovery Channel ROI */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-brand-400" /> Recovery Revenue by Channel
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickFormatter={(v) => `₹${v / 1000}K`} />
                <YAxis type="category" dataKey="channel" stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="recovered" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

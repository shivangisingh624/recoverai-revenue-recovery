import React from 'react';
import {
  LayoutDashboard,
  Zap,
  Users,
  CreditCard,
  Link,
  Target,
  Bot,
  BarChart3,
  Webhook,
  Settings,
  Sparkles,
  Heart,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  autonomyMode: 'COPILOT' | 'AUTOPILOT';
  onToggleAutonomy: (mode: 'COPILOT' | 'AUTOPILOT') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  autonomyMode,
  onToggleAutonomy,
}) => {
  const navItems = [
    { id: 'overview', label: 'Home', icon: LayoutDashboard },
    { id: 'recovery-queue', label: 'Recovery Queue', icon: Zap, badge: '18' },
    { id: 'customers', label: 'People', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'payment-links', label: 'Payment Links', icon: Link },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'ai-agent', label: 'AI Agent', icon: Bot },
    { id: 'analytics', label: 'Insights', icon: BarChart3 },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-[260px] bg-surface-900/95 border-r border-slate-800/60 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-0.5">
        {/* Logo */}
        <div
          className="h-[64px] flex items-center px-5 border-b border-slate-800/40 space-x-3 cursor-pointer group"
          onClick={() => setCurrentTab('landing')}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
            <Sparkles className="w-4 h-4 text-white heartbeat" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
              Recover<span className="text-brand-400">AI</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">Your revenue recovery partner</p>
          </div>
        </div>

        {/* AI Autonomy Switch */}
        <div className="p-3 mx-3 my-2.5 rounded-2xl bg-surface-950/70 border border-slate-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-brand-400" /> How should I work?
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider ${
                autonomyMode === 'AUTOPILOT'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
              }`}
            >
              {autonomyMode === 'AUTOPILOT' ? '🤖 Auto' : '🤝 Co-pilot'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800/50 text-xs">
            <button
              onClick={() => onToggleAutonomy('COPILOT')}
              className={`py-1.5 rounded-lg font-medium transition-all ${
                autonomyMode === 'COPILOT'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              data-tooltip="I'll suggest — you decide"
            >
              🤝 Together
            </button>
            <button
              onClick={() => onToggleAutonomy('AUTOPILOT')}
              className={`py-1.5 rounded-lg font-medium transition-all ${
                autonomyMode === 'AUTOPILOT'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              data-tooltip="I'll handle safe actions myself"
            >
              🤖 Autopilot
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
            {autonomyMode === 'COPILOT'
              ? "I'll recommend actions and wait for your approval."
              : 'Low-risk actions run automatically. Sensitive ones still need you.'}
          </p>
        </div>

        {/* Navigation items */}
        <nav className="px-3 space-y-0.5 pb-2">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all fade-in-up ${
                  active
                    ? 'bg-brand-600/15 text-brand-300 border border-brand-500/25 font-semibold shadow-sm shadow-brand-500/5'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                }`}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/25 tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Merchant Profile — Pinned at bottom */}
      <div className="p-3.5 border-t border-slate-800/40 bg-surface-950/40 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-indigo-500/20 shrink-0">
            M
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Merchant Admin</p>
            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-400" /> Razorpay Merchant
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

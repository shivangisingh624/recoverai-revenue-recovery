import React from 'react';
import { Play, MessageSquare, ShieldCheck, Sparkles, RefreshCw, Bot, Heart, Settings, ChevronDown } from 'lucide-react';
import { getGreeting } from '../../utils/humanize';

interface TopbarProps {
  mode: 'DEMO' | 'TEST' | 'LIVE';
  onOpenSimulation: () => void;
  onOpenCopilot: () => void;
  onRefresh: () => void;
  onOpenEnvModal?: () => void;
  onToggleMode?: () => void;
  onNavigateSettings?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  mode,
  onOpenSimulation,
  onOpenCopilot,
  onRefresh,
  onOpenEnvModal,
  onToggleMode,
  onNavigateSettings,
}) => {
  return (
    <header className="h-16 bg-surface-900/90 backdrop-blur-xl border-b border-slate-800/60 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Warm greeting + agent status */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute inset-0 animate-ping opacity-40"></span>
        </div>
        <div>
          <span className="text-sm font-bold text-white flex items-center gap-2">
            Your AI Recovery Partner
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/12 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 text-rose-400" /> Watching over your revenue
            </span>
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            Continuously monitoring payments & recovering lost revenue
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Interactive Mode indicator button */}
        <button
          type="button"
          onClick={() => {
            if (onOpenEnvModal) onOpenEnvModal();
            else if (onToggleMode) onToggleMode();
            else if (onNavigateSettings) onNavigateSettings();
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide border transition-all transform hover:scale-105 flex items-center gap-1.5 cursor-pointer shadow-sm ${
            mode === 'DEMO'
              ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/25'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
          }`}
          data-tooltip="Click to change environment mode"
          data-tooltip-pos="bottom"
        >
          <span>{mode === 'DEMO' ? '🧪 Demo Mode' : mode === 'TEST' ? '🔧 Test Mode' : '🟢 Live Mode'}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </button>

        {/* Refresh — group hover spins icon, keeps tooltip upright */}
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 rounded-xl bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors group relative"
          data-tooltip="Refresh data"
          data-tooltip-pos="bottom"
        >
          <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />
        </button>

        {/* AI Simulation Button */}
        <button
          type="button"
          onClick={onOpenSimulation}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>See AI in Action</span>
        </button>

        {/* Copilot Chat Toggle */}
        <button
          type="button"
          onClick={onOpenCopilot}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chat with AI</span>
        </button>
      </div>
    </header>
  );
};

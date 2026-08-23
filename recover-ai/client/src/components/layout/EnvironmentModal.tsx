import React, { useState, useEffect } from 'react';
import { X, Settings, ShieldCheck, Check, Zap, Sparkles } from 'lucide-react';
import { fetchMerchantSettings, updateMerchantSettings } from '../../services/api';

interface EnvironmentModalProps {
  isOpen: boolean;
  currentMode: 'DEMO' | 'TEST' | 'LIVE';
  onClose: () => void;
  onRefresh: () => void;
  onNavigateSettings: () => void;
}

export const EnvironmentModal: React.FC<EnvironmentModalProps> = ({
  isOpen,
  currentMode,
  onClose,
  onRefresh,
  onNavigateSettings,
}) => {
  const [selectedMode, setSelectedMode] = useState<'DEMO' | 'TEST' | 'LIVE'>(currentMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedMode(currentMode);
  }, [currentMode]);

  if (!isOpen) return null;

  const handleSelect = async (mode: 'DEMO' | 'TEST' | 'LIVE') => {
    setSelectedMode(mode);
    setSaving(true);
    try {
      await updateMerchantSettings({ mode });
      onRefresh();
      setTimeout(() => {
        setSaving(false);
        onClose();
      }, 300);
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Environment Mode Switcher</h3>
              <p className="text-xs text-slate-400">Select active Razorpay operation mode</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {/* DEMO MODE OPTION */}
          <div
            onClick={() => handleSelect('DEMO')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedMode === 'DEMO'
                ? 'bg-indigo-600/15 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-indigo-300 flex items-center gap-1.5">
                🧪 DEMO MODE (Seeded Data)
              </span>
              {selectedMode === 'DEMO' && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                  Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Zero API setup required. Uses rich simulated Razorpay payment failure data & mock link generation.
            </p>
          </div>

          {/* RAZORPAY TEST MODE OPTION */}
          <div
            onClick={() => handleSelect('TEST')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedMode === 'TEST'
                ? 'bg-emerald-600/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5">
                🔧 RAZORPAY TEST MODE
              </span>
              {selectedMode === 'TEST' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Connects to your real Razorpay Test API keys (<code className="text-emerald-400">rzp_test_...</code>) to issue genuine payment links.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateSettings();
            }}
            className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configure Razorpay API Keys</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

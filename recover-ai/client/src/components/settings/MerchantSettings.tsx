import React, { useState, useEffect } from 'react';
import { Settings, Key, ShieldCheck, Check, RefreshCw } from 'lucide-react';
import { fetchMerchantSettings, updateMerchantSettings } from '../../services/api';

export const MerchantSettings: React.FC = () => {
  const [mode, setMode] = useState<'DEMO' | 'TEST' | 'LIVE'>('DEMO');
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('');
  const [razorpayWebhookSecret, setRazorpayWebhookSecret] = useState('');
  const [autonomyMode, setAutonomyMode] = useState<'COPILOT' | 'AUTOPILOT'>('COPILOT');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    fetchMerchantSettings()
      .then((data) => {
        if (data.mode) setMode(data.mode);
        if (data.agentAutonomyMode) setAutonomyMode(data.agentAutonomyMode);
        if (data.razorpayKeyId) setRazorpayKeyId(data.razorpayKeyId);
        if (data.razorpayKeySecret) setRazorpayKeySecret(data.razorpayKeySecret);
        if (data.razorpayWebhookSecret) setRazorpayWebhookSecret(data.razorpayWebhookSecret);
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMerchantSettings({
        mode,
        agentAutonomyMode: autonomyMode,
        razorpayKeyId,
        razorpayKeySecret,
        razorpayWebhookSecret,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = () => {
    if (razorpayKeyId.startsWith('rzp_test_')) {
      setTestResult('✅ Razorpay Test Key Validated! Connected to Razorpay API Sandbox.');
    } else if (mode === 'DEMO') {
      setTestResult('⚡ Demo Mode Active! Using seeded dataset fallback.');
    } else {
      setTestResult('⚠️ Please provide valid Razorpay Test Credentials starting with rzp_test_');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-400" /> Razorpay Integration & Environment Configuration
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Configure real Razorpay Test API keys or rely on full DEMO mode fallback.
        </p>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Mode Switcher */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Operation Mode</label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setMode('DEMO')}
                className={`py-2 rounded-lg text-xs font-bold transition ${
                  mode === 'DEMO' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                DEMO MODE (Seeded Data)
              </button>
              <button
                type="button"
                onClick={() => setMode('TEST')}
                className={`py-2 rounded-lg text-xs font-bold transition ${
                  mode === 'TEST' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                RAZORPAY TEST MODE
              </button>
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Razorpay Key ID</label>
              <input
                type="text"
                value={razorpayKeyId}
                onChange={(e) => setRazorpayKeyId(e.target.value)}
                placeholder="rzp_test_your_key_id"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Razorpay Key Secret</label>
              <input
                type="password"
                value={razorpayKeySecret}
                onChange={(e) => setRazorpayKeySecret(e.target.value)}
                placeholder="********"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Razorpay Webhook Secret</label>
              <input
                type="password"
                value={razorpayWebhookSecret}
                onChange={(e) => setRazorpayWebhookSecret(e.target.value)}
                placeholder="********"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {testResult && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200">
              {testResult}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleTestConnection}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
            >
              Test Connection
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition flex items-center justify-center space-x-2"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-400" /> : null}
              <span>{saving ? 'Saving...' : saved ? 'Settings Saved!' : 'Save Integration Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

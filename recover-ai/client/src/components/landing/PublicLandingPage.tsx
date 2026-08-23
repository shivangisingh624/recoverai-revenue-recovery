import React from 'react';
import { Sparkles, Play, ShieldAlert, Zap, CheckCircle2, ArrowRight, Bot, CreditCard, Lock } from 'lucide-react';

interface PublicLandingPageProps {
  onLaunchDashboard: () => void;
  onWatchDemo: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onLaunchDashboard,
  onWatchDemo,
}) => {
  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* Header */}
      <header className="h-20 border-b border-slate-800/80 px-8 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <span className="font-extrabold text-xl tracking-wide">
            Recover<span className="text-brand-500">AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onWatchDemo}
            className="px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-bold transition"
          >
            Watch AI Demo
          </button>
          <button
            onClick={onLaunchDashboard}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition flex items-center space-x-2"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>RAZORPAY RECOVERY TRACK — AUTONOMOUS REVENUE RECOVERY AGENT</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl font-sans mb-6">
          Recover the revenue you <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">already earned.</span>
        </h1>

        <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
          RecoverAI uses autonomous AI agents to identify failed payments, prioritize recovery opportunities, personalize customer outreach, and recover lost revenue through Razorpay.
        </p>

        <div className="flex items-center space-x-4 mb-12">
          <button
            onClick={onLaunchDashboard}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-600/25 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onWatchDemo}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-current text-emerald-400" />
            <span>Watch AI Simulation</span>
          </button>
        </div>

        {/* Hero Metric Card */}
        <div className="w-full max-w-3xl glass-card p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden text-left mb-16">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Live Agent Impact</span>
            </div>
            <span className="text-xs text-brand-400 font-mono font-bold">53.6% RECOVERY RATE</span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Revenue at Risk</span>
              <p className="text-2xl font-extrabold text-amber-400 font-mono mt-1">₹4.82L</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">AI Recoverable</span>
              <p className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">₹2.31L</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Recovered by AI</span>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">₹1.24L</p>
            </div>
          </div>
        </div>

        {/* How It Works Loop */}
        <div className="w-full text-left my-8">
          <h2 className="text-xl font-bold text-white text-center mb-8">Autonomous Revenue Lifecycle</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { title: 'DETECT', desc: 'Monitors Razorpay failures' },
              { title: 'UNDERSTAND', desc: 'Scores customer LTV & history' },
              { title: 'DECIDE', desc: 'Selects optimal recovery strategy' },
              { title: 'ACT', desc: 'Generates & sends 1-click links' },
              { title: 'RECOVER', desc: 'Captures recovered funds' },
              { title: 'LEARN', desc: 'Optimizes scoring weights' },
            ].map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-xs font-extrabold text-brand-400 block font-mono mb-1">{step.title}</span>
                <p className="text-[11px] text-slate-400 leading-tight">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 font-mono">
        RecoverAI — Built for Razorpay AI Revenue Recovery Hackathon 2026
      </footer>
    </div>
  );
};

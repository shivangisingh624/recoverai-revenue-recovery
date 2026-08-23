import React, { useState, useEffect } from 'react';
import { Bot, CheckCircle2, Loader2, Sparkles, X, ArrowRight } from 'lucide-react';
import { runAISimulation } from '../../services/api';

interface AISimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulationComplete: () => void;
}

export const AISimulatorModal: React.FC<AISimulatorModalProps> = ({
  isOpen,
  onClose,
  onSimulationComplete,
}) => {
  const [step, setStep] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const steps = [
    'Scanning 247 Razorpay transactions...',
    'Detecting revenue leakage & payment failures...',
    'Scoring customer profiles & lifetime history...',
    'Predicting recovery probability per transaction...',
    'Generating personalized WhatsApp & Email recovery strategies...',
    'Executing approved 1-click Razorpay payment link recovery actions...',
    'Finalizing revenue recovery updates...',
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setIsDone(false);
      return;
    }

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setStep(currentStep);
      } else {
        clearInterval(interval);
        setIsDone(true);
        runAISimulation().catch(console.error);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-900 border border-slate-700 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {!isDone ? (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
                <Bot className="w-6 h-6 text-brand-400 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI Agent Active Scanner</h3>
                <p className="text-xs text-slate-400">Autonomous Revenue Recovery Cycle</p>
              </div>
            </div>

            <div className="space-y-3 my-6">
              {steps.map((text, idx) => {
                const isActive = idx === step;
                const isCompleted = idx < step;
                return (
                  <div
                    key={idx}
                    className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-brand-600/20 border-brand-500/40 text-white font-medium shadow-lg shadow-brand-500/10'
                        : isCompleted
                        ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                        : 'opacity-40 border-transparent text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 text-brand-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-700 shrink-0"></div>
                    )}
                    <span className="text-sm font-mono">{text}</span>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 h-2 transition-all duration-500"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-500/20">
              <Sparkles className="w-10 h-10 text-emerald-400 animate-pulse" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Simulation Completed
            </span>

            <h3 className="text-3xl font-extrabold text-white mt-4 font-mono">
              ₹1,24,500
            </h3>
            <p className="text-sm text-slate-300 font-semibold mb-6">
              Revenue Recovered by AI Agent Today!
            </p>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2 mb-6 text-slate-300">
              <div className="flex justify-between">
                <span>Transactions Processed:</span>
                <span className="font-bold text-white">247</span>
              </div>
              <div className="flex justify-between">
                <span>High Priority Cases:</span>
                <span className="font-bold text-amber-400">18</span>
              </div>
              <div className="flex justify-between">
                <span>Recovery Actions Dispatched:</span>
                <span className="font-bold text-emerald-400">18 Links (WhatsApp/Email)</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-semibold">
                <span>Effective Recovery Rate:</span>
                <span className="text-brand-400 font-bold">53.6%</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSimulationComplete();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-brand-500/20 transition flex items-center justify-center space-x-2"
            >
              <span>View Dashboard Updates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { AgentActivity } from '../../types';
import { Bot, CheckCircle2, AlertTriangle, Sparkles, Clock, Send, Heart, TrendingUp, Zap } from 'lucide-react';
import { timeAgo } from '../../utils/humanize';

interface ActivityFeedProps {
  activities: AgentActivity[];
}

const getActivityEmoji = (description: string): { icon: React.ReactNode; color: string } => {
  const lower = description.toLowerCase();
  if (lower.includes('recover')) return { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-emerald-400 bg-emerald-500/15' };
  if (lower.includes('send') || lower.includes('email') || lower.includes('whatsapp')) return { icon: <Send className="w-3.5 h-3.5" />, color: 'text-cyan-400 bg-cyan-500/15' };
  if (lower.includes('risk') || lower.includes('fail') || lower.includes('alert')) return { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-amber-400 bg-amber-500/15' };
  if (lower.includes('score') || lower.includes('analyz')) return { icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'text-indigo-400 bg-indigo-500/15' };
  if (lower.includes('detect') || lower.includes('scan')) return { icon: <Zap className="w-3.5 h-3.5" />, color: 'text-brand-400 bg-brand-500/15' };
  return { icon: <Bot className="w-3.5 h-3.5" />, color: 'text-brand-400 bg-brand-500/15' };
};

const humanizeActivityText = (text: string): string => {
  // Make the activity feed feel conversational
  return text
    .replace(/Executed recovery action/i, '✅ Reached out to customer')
    .replace(/Scored customer/i, '📊 Analyzed customer profile for')
    .replace(/Detected failed payment/i, '👀 Spotted a failed payment')
    .replace(/Created payment link/i, '🔗 Generated a fresh payment link')
    .replace(/Sent recovery email/i, '📧 Sent a friendly recovery email')
    .replace(/Sent WhatsApp/i, '💬 Sent WhatsApp message');
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400 heartbeat" /> What I've Been Up To
        </h3>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live
        </span>
      </div>

      <div className="space-y-2.5">
        {activities.length === 0 ? (
          <div className="py-8 text-center">
            <Bot className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-xs text-slate-500">
              Nothing yet! Run the AI simulation to see me in action 🚀
            </p>
          </div>
        ) : (
          activities.map((act, idx) => {
            const { icon, color } = getActivityEmoji(act.description);
            return (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-start space-x-3 hover:border-slate-700/60 transition-colors fade-in-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className={`p-1.5 rounded-lg ${color} shrink-0 mt-0.5`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {humanizeActivityText(act.description)}
                  </p>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                    <Clock className="w-2.5 h-2.5" />
                    {timeAgo(act.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

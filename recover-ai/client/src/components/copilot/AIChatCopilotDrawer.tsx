import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, CheckCircle2, User, Play } from 'lucide-react';
import { sendCopilotChat } from '../../services/api';

interface AIChatCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  action?: string;
  data?: any;
  timestamp: string;
}

export const AIChatCopilotDrawer: React.FC<AIChatCopilotDrawerProps> = ({
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'AI',
      text: 'Hi Shrey 👋 I am your Recovery Copilot. How can I assist your revenue operations today?',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const inputMsg = textToSend || prompt;
    if (!inputMsg.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'USER',
      text: inputMsg,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setPrompt('');
    setLoading(true);

    try {
      const res = await sendCopilotChat(inputMsg);
      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'AI',
        text: res.reply,
        action: res.action,
        data: res.data,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (res.action === 'BATCH_EXECUTED') {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'Find high-value failed payments',
    'Recover all high-probability failed payments',
    'How much revenue is currently at risk?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-surface-900 border-l border-slate-800 h-full flex flex-col justify-between p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Recovery Copilot</h3>
              <p className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected to Backend Tools
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'USER'
                    ? 'bg-brand-600 text-white rounded-br-none shadow-md shadow-brand-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none font-sans'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Tool Execution Visual Output (Requirement 25) */}
                {msg.action === 'BATCH_EXECUTED' && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-emerald-400 font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Tool Executed: Batch Recovery Triggered!</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs italic bg-slate-950/60 p-3 rounded-xl max-w-[80%] border border-slate-800">
              <Bot className="w-4 h-4 text-brand-400 animate-spin" />
              <span>Executing backend AI recovery tools...</span>
            </div>
          )}
        </div>

        {/* Sample Prompt Chips */}
        <div className="py-2 flex flex-wrap gap-1.5 border-t border-slate-800/80">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-brand-600/30 text-slate-300 hover:text-white border border-slate-700/60 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2 pt-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Copilot to analyze, score, or execute recovery..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="p-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition shadow-lg shadow-brand-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

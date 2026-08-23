import React, { useState } from 'react';
import { WebhookEvent } from '../../types';
import { Webhook, CheckCircle2, AlertTriangle, Eye, ShieldCheck } from 'lucide-react';

interface WebhookLogsTableProps {
  logs: WebhookEvent[];
}

export const WebhookLogsTable: React.FC<WebhookLogsTableProps> = ({ logs }) => {
  const [selectedPayload, setSelectedPayload] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Webhook className="w-4 h-4 text-brand-400" /> Razorpay Webhook Event Audit Log
            </h3>
            <p className="text-xs text-slate-400">Real-time webhook signature verification & idempotency status</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            {logs.length} Webhook Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Event ID</th>
                <th className="py-3.5 px-4">Event Type</th>
                <th className="py-3.5 px-4">Signature Valid</th>
                <th className="py-3.5 px-4">Idempotency Status</th>
                <th className="py-3.5 px-4">Processed Timestamp</th>
                <th className="py-3.5 px-4 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                    {log.eventId}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {log.eventType}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Valid HMAC
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.idempotencyStatus === 'PROCESSED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {log.idempotencyStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    {new Date(log.processedAt).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedPayload(log.rawPayload)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] transition flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3 h-3" /> View JSON
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Payload Drawer / Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
            <h4 className="text-sm font-bold text-white mb-3">Webhook RAW JSON Payload</h4>
            <pre className="bg-slate-950 p-4 rounded-xl text-xs text-brand-300 font-mono overflow-x-auto max-h-96">
              {JSON.stringify(JSON.parse(selectedPayload), null, 2)}
            </pre>
            <button
              onClick={() => setSelectedPayload(null)}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

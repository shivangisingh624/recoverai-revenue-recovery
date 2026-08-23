import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { EnvironmentModal } from './components/layout/EnvironmentModal';
import { MetricsCards } from './components/dashboard/MetricsCards';
import { RevenueChart } from './components/dashboard/RevenueChart';
import { AISimulatorModal } from './components/dashboard/AISimulatorModal';
import { RecoveryQueueTable } from './components/recovery/RecoveryQueueTable';
import { CaseDetailModal } from './components/recovery/CaseDetailModal';
import { CustomerList } from './components/customers/CustomerList';
import { Customer360Drawer } from './components/customers/Customer360Drawer';
import { AddCustomerModal } from './components/customers/AddCustomerModal';
import { TransactionTable } from './components/transactions/TransactionTable';
import { FailureAnalysis } from './components/transactions/FailureAnalysis';
import { PaymentLinkGeneratorModal } from './components/paymentLinks/PaymentLinkGeneratorModal';
import { CampaignList } from './components/campaigns/CampaignList';
import { AgentControlCenter } from './components/aiAgent/AgentControlCenter';
import { ActivityFeed } from './components/aiAgent/ActivityFeed';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { WebhookLogsTable } from './components/webhooks/WebhookLogsTable';
import { AIChatCopilotDrawer } from './components/copilot/AIChatCopilotDrawer';
import { MerchantSettings } from './components/settings/MerchantSettings';
import { PublicLandingPage } from './components/landing/PublicLandingPage';
import { DashboardSummary, RecoveryCase, Customer, Transaction, PaymentLink, Campaign, WebhookEvent, AgentActivity } from './types';
import {
  fetchDashboardSummary,
  fetchRecoveryCases,
  fetchCustomers,
  fetchTransactions,
  fetchPaymentLinks,
  fetchCampaigns,
  fetchWebhookLogs,
  updateMerchantSettings,
} from './services/api';
import { Sparkles, Plus, Play, RefreshCw, Bot, UserPlus } from 'lucide-react';
import { formatINRLakhs } from './utils/currency';
import { getGreeting } from './utils/humanize';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [autonomyMode, setAutonomyMode] = useState<'COPILOT' | 'AUTOPILOT'>('COPILOT');
  const [mode, setMode] = useState<'DEMO' | 'TEST' | 'LIVE'>('DEMO');

  // Modals & Drawers
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isPaymentLinkModalOpen, setIsPaymentLinkModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<RecoveryCase | null>(null);

  // Data states
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recoveryCases, setRecoveryCases] = useState<RecoveryCase[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookEvent[]>([]);
  const [activities, setActivities] = useState<AgentActivity[]>([]);

  const loadData = async () => {
    try {
      const sumData = await fetchDashboardSummary();
      setSummary(sumData);
      setActivities(sumData.activities || []);
      if (sumData.merchant) {
        setAutonomyMode(sumData.merchant.agentAutonomyMode as any);
        setMode(sumData.merchant.mode as any);
      }

      const cases = await fetchRecoveryCases();
      setRecoveryCases(cases);

      const custs = await fetchCustomers();
      setCustomers(custs);

      const txs = await fetchTransactions();
      setTransactions(txs);

      const plinks = await fetchPaymentLinks();
      setPaymentLinks(plinks);

      const camps = await fetchCampaigns();
      setCampaigns(camps);

      const hooks = await fetchWebhookLogs();
      setWebhookLogs(hooks);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAutonomy = async (newMode: 'COPILOT' | 'AUTOPILOT') => {
    setAutonomyMode(newMode);
    try {
      await updateMerchantSettings({ agentAutonomyMode: newMode });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleMode = async () => {
    const nextMode = mode === 'DEMO' ? 'TEST' : 'DEMO';
    setMode(nextMode);
    try {
      await updateMerchantSettings({ mode: nextMode });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  if (currentTab === 'landing') {
    return (
      <PublicLandingPage
        onLaunchDashboard={() => setCurrentTab('overview')}
        onWatchDemo={() => setIsSimulationOpen(true)}
      />
    );
  }

  const defaultMetrics = summary?.metrics || {
    revenueAtRiskPaise: 48200000,
    predictedRecoverablePaise: 23150000,
    recoveredPaise: 9240000,
    recoveryRate: 53.6,
  };

  const failureItems = [
    { reason: 'EXPIRED_LINK', count: 50, amountRupees: 200000, recoveryProbability: 88 },
    { reason: 'TECHNICAL_FAILURE', count: 28, amountRupees: 140000, recoveryProbability: 82 },
    { reason: 'INSUFFICIENT_FUNDS', count: 22, amountRupees: 95000, recoveryProbability: 64 },
    { reason: 'BANK_DECLINE', count: 18, amountRupees: 47000, recoveryProbability: 55 },
  ];

  return (
    <div className="flex min-h-screen bg-surface-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        autonomyMode={autonomyMode}
        onToggleAutonomy={handleToggleAutonomy}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          mode={mode}
          onOpenSimulation={() => setIsSimulationOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          onRefresh={loadData}
          onOpenEnvModal={() => setIsEnvModalOpen(true)}
          onToggleMode={handleToggleMode}
          onNavigateSettings={() => setCurrentTab('settings')}
        />


        <main className="p-6 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          {/* Greeting Banner */}
          <div className="flex items-center justify-between bg-gradient-to-r from-brand-900/30 via-indigo-900/20 to-surface-900 border border-brand-500/20 p-5 rounded-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">{getGreeting()}</h2>
              <p className="text-xs text-slate-300 font-medium">
                Your AI Recovery Agent recovered <span className="text-emerald-400 font-bold font-mono">₹92,400</span> this week.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs shadow-md transition flex items-center space-x-1.5 border border-slate-700/60"
              >
                <UserPlus className="w-4 h-4 text-brand-400" />
                <span>Add Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPaymentLinkModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Recovery Link</span>
              </button>
            </div>
          </div>

          {/* Render Tab Content */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              <MetricsCards metrics={defaultMetrics} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <RevenueChart />
                  <RecoveryQueueTable
                    cases={recoveryCases}
                    onRefresh={loadData}
                    onSelectCase={(c) => setSelectedCase(c)}
                  />
                </div>
                <div className="space-y-6">
                  <ActivityFeed activities={activities} />
                  <FailureAnalysis failures={failureItems} />
                </div>
              </div>
            </div>
          )}

          {currentTab === 'recovery-queue' && (
            <RecoveryQueueTable
              cases={recoveryCases}
              onRefresh={loadData}
              onSelectCase={(c) => setSelectedCase(c)}
            />
          )}

          {currentTab === 'customers' && (
            <CustomerList
              customers={customers}
              onSelectCustomer={(id) => setSelectedCustomerId(id)}
              onRefresh={loadData}
              onOpenAddCustomer={() => setIsAddCustomerModalOpen(true)}
            />
          )}


          {currentTab === 'transactions' && <TransactionTable transactions={transactions} />}

          {currentTab === 'payment-links' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Payment Links Manager</h3>
                <button
                  onClick={() => setIsPaymentLinkModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition"
                >
                  + Generate New Payment Link
                </button>
              </div>
              <div className="glass-card rounded-2xl border border-slate-800 p-4">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Link ID</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Short URL</th>
                      <th className="p-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {paymentLinks.map((pl) => (
                      <tr key={pl.id} className="hover:bg-slate-800/40">
                        <td className="p-3 text-brand-400 font-bold">{pl.razorpayPaymentLinkId}</td>
                        <td className="p-3 font-bold text-white">{formatINRLakhs(pl.amountPaise)}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            {pl.status}
                          </span>
                        </td>
                        <td className="p-3 text-cyan-400">{pl.shortUrl}</td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {new Date(pl.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentTab === 'campaigns' && <CampaignList campaigns={campaigns} onRefresh={loadData} />}

          {currentTab === 'ai-agent' && (
            <div className="space-y-6">
              <AgentControlCenter
                status={summary?.agentStatus.status || 'ACTIVE'}
                autonomyMode={autonomyMode}
                onRefresh={loadData}
              />
              <ActivityFeed activities={activities} />
            </div>
          )}

          {currentTab === 'analytics' && <AnalyticsDashboard />}

          {currentTab === 'webhooks' && <WebhookLogsTable logs={webhookLogs} />}

          {currentTab === 'settings' && <MerchantSettings />}
        </main>
      </div>

      {/* Interactive Modals & Drawers */}
      <AISimulatorModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        onSimulationComplete={loadData}
      />

      <AIChatCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onRefresh={loadData}
      />

      <PaymentLinkGeneratorModal
        isOpen={isPaymentLinkModalOpen}
        customers={customers}
        onClose={() => setIsPaymentLinkModalOpen(false)}
        onSuccess={loadData}
      />

      <Customer360Drawer
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />

      <CaseDetailModal
        caseData={selectedCase}
        onClose={() => setSelectedCase(null)}
        onRefresh={loadData}
      />

      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        onSuccess={loadData}
      />

      <EnvironmentModal
        isOpen={isEnvModalOpen}
        currentMode={mode}
        onClose={() => setIsEnvModalOpen(false)}
        onRefresh={loadData}
        onNavigateSettings={() => setCurrentTab('settings')}
      />
    </div>
  );
}

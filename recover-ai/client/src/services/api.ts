import { DashboardSummary, RecoveryCase, Customer, Transaction, PaymentLink, Campaign, WebhookEvent, AgentActivity } from '../types';

const API_BASE = '/api';

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE}/dashboard/summary`);
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  return res.json();
}

export async function fetchRecoveryCases(status?: string): Promise<RecoveryCase[]> {
  const url = status ? `${API_BASE}/recovery/cases?status=${status}` : `${API_BASE}/recovery/cases`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch recovery cases');
  return res.json();
}

export async function approveRecoveryAction(caseId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/recovery/${caseId}/approve`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to approve action');
  return res.json();
}

export async function rejectRecoveryAction(caseId: string, reason?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/recovery/${caseId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error('Failed to reject action');
  return res.json();
}

export async function executeRecoveryAction(caseId: string, customMessage?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/recovery/${caseId}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customMessage }),
  });
  if (!res.ok) throw new Error('Failed to execute action');
  return res.json();
}

export async function runAISimulation(): Promise<any> {
  const res = await fetch(`${API_BASE}/recovery/simulate`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to run simulation');
  return res.json();
}

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE}/customers`);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
}

export async function fetchCustomer360(id: string): Promise<{ customer: Customer; aiInsight: string }> {
  const res = await fetch(`${API_BASE}/customers/${id}`);
  if (!res.ok) throw new Error('Failed to fetch customer profile');
  return res.json();
}

export async function createCustomer(payload: { name: string; email: string; phone?: string; cltvRupees?: number }): Promise<Customer> {
  const res = await fetch(`${API_BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create customer');
  return res.json();
}

export async function deleteCustomer(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/customers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete customer');
  return res.json();
}


export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch(`${API_BASE}/transactions`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function fetchPaymentLinks(): Promise<PaymentLink[]> {
  const res = await fetch(`${API_BASE}/payment-links`);
  if (!res.ok) throw new Error('Failed to fetch payment links');
  return res.json();
}

export async function createPaymentLink(payload: any): Promise<any> {
  const res = await fetch(`${API_BASE}/payment-links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create payment link');
  return res.json();
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch(`${API_BASE}/campaigns`);
  if (!res.ok) throw new Error('Failed to fetch campaigns');
  return res.json();
}

export async function createCampaign(payload: any): Promise<Campaign> {
  const res = await fetch(`${API_BASE}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create campaign');
  return res.json();
}

export async function runCampaign(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/campaigns/${id}/run`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to run campaign');
  return res.json();
}

export async function fetchWebhookLogs(): Promise<WebhookEvent[]> {
  const res = await fetch(`${API_BASE}/webhooks`);
  if (!res.ok) throw new Error('Failed to fetch webhooks');
  return res.json();
}

export async function fetchAnalytics(): Promise<any> {
  const res = await fetch(`${API_BASE}/analytics/revenue`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function sendCopilotChat(prompt: string): Promise<any> {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error('Failed to send message to Copilot');
  return res.json();
}

export async function fetchMerchantSettings(): Promise<any> {
  const res = await fetch(`${API_BASE}/merchant/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateMerchantSettings(payload: any): Promise<any> {
  const res = await fetch(`${API_BASE}/merchant/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

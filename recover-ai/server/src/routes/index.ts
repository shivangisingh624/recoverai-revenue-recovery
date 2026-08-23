import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { login, register } from '../controllers/authController';
import { getDashboardSummary } from '../controllers/dashboardController';
import { getTransactions, getTransactionById } from '../controllers/transactionController';
import { getCustomers, getCustomer360, createCustomer, deleteCustomer } from '../controllers/customerController';
import {
  getRecoveryCases,
  getRecoveryCaseById,
  analyzeTransaction,
  executeCaseAction,
  approveCaseAction,
  rejectCaseAction,
  runSimulation,
} from '../controllers/recoveryController';
import { createPaymentLink, getPaymentLinks } from '../controllers/paymentLinkController';
import { getCampaigns, createCampaign, runCampaign } from '../controllers/campaignController';
import { chatCopilot } from '../controllers/aiController';
import { handleRazorpayWebhook, getWebhookLogs } from '../controllers/webhookController';
import { getAnalytics } from '../controllers/analyticsController';
import { getMerchantSettings, updateMerchantSettings } from '../controllers/merchantController';

const router = Router();

// Public Auth Routes
router.post('/auth/login', login);
router.post('/auth/register', register);

// Public / Signature-verified Webhook endpoint
router.post('/webhooks/razorpay', handleRazorpayWebhook);

// Protected API Routes
router.use(authMiddleware);

// Dashboard
router.get('/dashboard/summary', getDashboardSummary);

// Transactions
router.get('/transactions', getTransactions);
router.get('/transactions/:id', getTransactionById);

// Customers
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomer360);
router.post('/customers', createCustomer);
router.delete('/customers/:id', deleteCustomer);

// Recovery Cases & Agent Actions
router.get('/recovery/cases', getRecoveryCases);
router.get('/recovery/cases/:id', getRecoveryCaseById);
router.post('/recovery/analyze', analyzeTransaction);
router.post('/recovery/:id/execute', executeCaseAction);
router.post('/recovery/:id/approve', approveCaseAction);
router.post('/recovery/:id/reject', rejectCaseAction);
router.post('/recovery/simulate', runSimulation);

// Payment Links (Supports Razorpay API endpoint POST /api/razorpay/payment-links)
router.post('/payment-links', createPaymentLink);
router.post('/razorpay/payment-links', createPaymentLink);
router.get('/payment-links', getPaymentLinks);

// Campaigns
router.get('/campaigns', getCampaigns);
router.post('/campaigns', createCampaign);
router.post('/campaigns/:id/run', runCampaign);

// AI Copilot & Analysis
router.post('/ai/chat', chatCopilot);
router.post('/ai/analyze', analyzeTransaction);

// Webhook Audit Logs
router.get('/webhooks', getWebhookLogs);

// Analytics
router.get('/analytics/revenue', getAnalytics);
router.get('/analytics/recovery', getAnalytics);
router.get('/analytics/failures', getAnalytics);

// Settings
router.get('/merchant/settings', getMerchantSettings);
router.post('/merchant/settings', updateMerchantSettings);

export default router;

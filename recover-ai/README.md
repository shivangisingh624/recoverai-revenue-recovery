# RecoverAI — Autonomous AI Revenue Recovery Agent for Razorpay

> **Razorpay Hackathon Entry — AI Revenue Recovery Track**

RecoverAI is a full-stack, production-grade autonomous AI revenue recovery platform for merchants. It connects directly to Razorpay payment streams to continuously detect revenue at risk, analyze customer payment behavior, calculate 0–100 recovery scores, generate personalized multi-channel recovery strategies (WhatsApp, Email, SMS), and automatically execute or recommend recovery actions.

---

## 🎯 Problem Statement & Product Vision

Every month, merchants lose millions in revenue due to:
1. Failed payment attempts (bank declines, insufficient funds, network timeouts)
2. Abandoned checkout sessions
3. Expired payment links
4. Partially paid orders
5. Overdue payment requests

Traditional analytics tools only display static metrics ("You lost ₹4,82,000 this month"). **RecoverAI acts as an autonomous AI employee for a merchant's finance & revenue team**, turning passive loss into active recovery:

$$\text{DETECT} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{DECIDE} \longrightarrow \text{ACT} \longrightarrow \text{RECOVER} \longrightarrow \text{LEARN}$$

---

## 🚀 Key Features

- **⚡ Dual Mode Operation**:
  - **DEMO MODE**: Out-of-the-box seeded Indian merchant dataset (100+ customers, 500+ transactions, 50+ recovery cases) for offline hackathon judging.
  - **RAZORPAY TEST MODE**: Live integration with official Razorpay APIs (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`).
- **🤖 Autonomous AI Engine & Decision System**:
  - **0–100 Recovery Scoring Algorithm**: Multi-variable weighting based on transaction value, recency, failure reason recoverability index, customer lifetime value (LTV), and payment history ratio.
  - **Autopilot vs. Copilot Autonomy**: Toggle between 100% automated execution for high-confidence cases and human approval mode for sensitive high-value cases.
  - **Explainable AI (XAI)**: Concise business rationale provided for every case ("Why this customer?", "Why this action?").
- **💬 Personalized Multi-Channel Messaging**:
  - Context-aware recovery messages tailored for WhatsApp, Email, and SMS with embedded 1-click Razorpay payment links.
- **🛡️ Webhook Engine & Idempotency**:
  - Real-time HMAC-SHA256 signature verification against raw HTTP payloads.
  - Strict idempotency checking via Razorpay `eventId` to prevent duplicate processing.
- **📊 Customer 360 View**:
  - Full profile, lifetime value, transaction timeline, and AI Customer Insights.
- **💬 Recovery Copilot Chat**:
  - Interactive AI assistant in the dashboard capable of running natural language queries ("Find high-value failed payments", "Recover high-probability failed payments") and executing backend tools.
- **🎬 Interactive AI Recovery Simulator**:
  - Animated 7-step visual scanner demonstrating real-time transaction scanning, scoring, strategy generation, and revenue recovery.

---

## 🏗️ Architecture & Tech Stack

```
                                  ┌──────────────────────────────────────────┐
                                  │      React + Vite + TypeScript Frontend   │
                                  │  (Tailwind CSS, Recharts, Lucide React)  │
                                  └────────────────────┬─────────────────────┘
                                                       │ REST API & Webhooks
                                                       ▼
                                  ┌──────────────────────────────────────────┐
                                  │       Node.js + Express Backend API       │
                                  │              (TypeScript)                │
                                  └──────┬─────────────┼─────────────┬───────┘
                                         │             │             │
                          ┌──────────────▼──┐   ┌──────▼──────┐   ┌──▼──────────────┐
                          │ AI Recovery     │   │ Razorpay    │   │ Notification    │
                          │ Engine & Agent  │   │ Test SDK    │   │ Delivery Engine │
                          └──────────────┬──┘   └──────┬──────┘   └──┬──────────────┘
                                         │             │             │
                                         └─────────────┼─────────────┘
                                                       ▼
                                              ┌─────────────────┐
                                              │ Prisma ORM      │
                                              │ (SQLite/Postgres│
                                              └─────────────────┘
```

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, Razorpay Node SDK, bcryptjs, jsonwebtoken.
- **Database**: SQLite (Zero-config local execution) / PostgreSQL compatible via Prisma.

---

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Quick Start (Monorepo Setup)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/recover-ai.git
   cd recover-ai
   ```

2. **Run Monorepo Setup (Installs packages, pushes DB schema & seeds dataset)**:
   ```bash
   npm run setup
   ```

3. **Start Development Servers (Server on 5000, Frontend on 5173)**:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

---

## 🔑 Environment Variables (`.env`)

```env
DATABASE_URL="file:./dev.db"
PORT=5000
JWT_SECRET="recover_ai_super_secret_jwt_key_2026_razorpay_hackathon"
APP_URL="http://localhost:5173"

# Razorpay Credentials (Optional - Falls back to Demo Mode if missing)
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"

# AI Provider Key (Optional - Uses deterministic AI engine if missing)
AI_API_KEY="your_api_key"
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | Dashboard metrics, Revenue at Risk & AI stats |
| `GET` | `/api/recovery/cases` | Priority recovery queue sorted by AI score |
| `POST` | `/api/recovery/:id/execute` | Execute recovery action (dispatches link) |
| `POST` | `/api/recovery/:id/approve` | Human approval of pending Copilot case |
| `POST` | `/api/recovery/simulate` | Triggers interactive AI simulation scenario |
| `POST` | `/api/payment-links` | Generates Razorpay Payment Link via backend |
| `POST` | `/api/webhooks/razorpay` | Razorpay Webhook endpoint with HMAC verification |
| `POST` | `/api/ai/chat` | Recovery Copilot AI assistant chat handler |
| `GET` | `/api/customers/:id` | Customer 360 profile, stats & AI insight |

---

## 🏆 Hackathon Demo Walkthrough

1. **Launch App**: Click "Launch Dashboard" or "Run AI Simulation" on top bar.
2. **Observe AI Simulator**: Watch the 7-step animated scanner evaluate transactions and recover ₹1,24,500 in real time.
3. **Toggle AI Autonomy**: Switch from **Copilot** to **Autopilot** in the left sidebar to enable auto-execution.
4. **Inspect Recovery Queue**: Click on any row to open the AI Case Detail Modal and view "WHY THIS CUSTOMER?" and "WHY THIS ACTION?".
5. **Open Recovery Copilot**: Click "Recovery Copilot" in the top bar and type `"Find high-value failed payments"` or `"Recover all high-probability failed payments"`.
6. **Razorpay Test Integration**: Go to Settings to input Razorpay Test API keys and test real payment link generation.

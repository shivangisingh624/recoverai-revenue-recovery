import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { rawBodyMiddleware } from './middleware/rawBody';

const app = express();

app.use(cors());

// Webhook endpoint requires raw body for HMAC SHA256 signature verification
app.use('/api/webhooks/razorpay', rawBodyMiddleware);

// Standard JSON body parsing for all other routes
app.use(express.json());

// API Routes
app.use('/api', routes);

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'RecoverAI Backend', timestamp: new Date().toISOString() });
});

app.listen(config.port, () => {
  console.log(`🚀 RecoverAI Server running on port ${config.port}`);
});

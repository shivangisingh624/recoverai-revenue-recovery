import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AIEngine } from '../services/aiEngine';

export async function chatCopilot(req: AuthRequest, res: Response) {
  try {
    const merchantId = req.user?.merchantId || 'demo-merchant-1';
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const result = await AIEngine.processCopilotChat(merchantId, prompt);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

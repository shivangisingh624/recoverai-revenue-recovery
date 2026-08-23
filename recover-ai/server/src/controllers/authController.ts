import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth';

export async function login(req: AuthRequest, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, merchantId: user.merchantId },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, merchantId: user.merchantId },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function register(req: AuthRequest, res: Response) {
  try {
    const { name, email, password, merchantName } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const merchant = await prisma.merchant.create({
      data: { name: merchantName || `${name}'s Store`, mode: 'DEMO' },
    });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        merchantId: merchant.id,
        role: 'ADMIN',
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, merchantId: user.merchantId },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, merchantId: user.merchantId },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

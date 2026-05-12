import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

export const authRouter = Router();

function signToken(userId: number): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '30d' });
}

authRouter.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body as { name: string; email: string; password: string };

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email and password are required' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (existing) {
    res.status(409).json({ error: 'Email already in use' });
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const { data: user, error } = await supabase
    .from('users')
    .insert({ name: name.trim(), email: email.toLowerCase().trim(), password_hash })
    .select('id, name, email, is_pro')
    .single();

  if (error || !user) {
    res.status(500).json({ error: 'Failed to create account' });
    return;
  }

  res.status(201).json({ token: signToken(user.id), user });
});

authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, name, email, password_hash, is_pro')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash as string);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const { password_hash: _ph, ...safeUser } = user as { id: number; name: string; email: string; password_hash: string; is_pro: boolean };
  res.json({ token: signToken(safeUser.id), user: safeUser });
});

authRouter.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  const { data: user } = await supabase
    .from('users')
    .select('id, name, email, is_pro, created_at')
    .eq('id', req.userId!)
    .maybeSingle();

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ user });
});

import { Router, Response } from 'express';
import { supabase } from '../db/database';
import { optionalAuth, AuthRequest } from '../middleware/auth';

export const promptsRouter = Router();

interface PromptRow {
  id: number;
  title: string;
  description: string;
  category: string;
  preview_url: string;
  prompt_text: string;
  ai_tool: string;
  tags: string[];
  is_featured: boolean;
  is_free: boolean;
  created_at: string;
}

function sanitize(prompt: PromptRow, userIsPro: boolean) {
  const accessible = prompt.is_free || userIsPro;
  return {
    id: prompt.id,
    title: prompt.title,
    description: prompt.description,
    category: prompt.category,
    preview_url: prompt.preview_url,
    ai_tool: prompt.ai_tool,
    tags: prompt.tags,
    is_featured: prompt.is_featured,
    is_free: prompt.is_free,
    created_at: prompt.created_at,
    accessible,
    prompt_preview: prompt.prompt_text.slice(0, 60) + '…',
    prompt_text: accessible ? prompt.prompt_text : null,
  };
}

async function getProStatus(userId: number | undefined): Promise<boolean> {
  if (!userId) return false;
  const { data } = await supabase.from('users').select('is_pro').eq('id', userId).maybeSingle();
  return (data as { is_pro: boolean } | null)?.is_pro ?? false;
}

promptsRouter.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const { category } = req.query as { category?: string };

  let query = supabase.from('prompts').select('*').order('is_featured', { ascending: false }).order('created_at', { ascending: false });

  if (category && ['image', 'video', 'website'].includes(category)) {
    query = query.eq('category', category);
  }

  const { data: prompts, error } = await query;
  if (error) {
    res.status(500).json({ error: 'Failed to fetch prompts' });
    return;
  }

  const isPro = await getProStatus(req.userId);
  res.json((prompts as PromptRow[]).map((p) => sanitize(p, isPro)));
});

promptsRouter.get('/user/prompts', optionalAuth, async (req: AuthRequest, res: Response) => {
  const isPro = await getProStatus(req.userId);
  if (!isPro) {
    res.json([]);
    return;
  }

  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({ error: 'Failed to fetch prompts' });
    return;
  }

  res.json((prompts as PromptRow[]).map((p) => sanitize(p, true)));
});

promptsRouter.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  const { data: prompt, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();

  if (error || !prompt) {
    res.status(404).json({ error: 'Prompt not found' });
    return;
  }

  const isPro = await getProStatus(req.userId);
  res.json(sanitize(prompt as PromptRow, isPro));
});

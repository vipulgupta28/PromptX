import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { supabase } from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

export const paymentsRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
});

const PRO_PRICE_CENTS = 1000; // $10.00

paymentsRouter.post('/create-pro-checkout', requireAuth, async (req: AuthRequest, res: Response) => {
  // Check if already Pro
  const { data: user } = await supabase
    .from('users')
    .select('is_pro')
    .eq('id', req.userId!)
    .maybeSingle();

  if ((user as { is_pro: boolean } | null)?.is_pro) {
    res.status(400).json({ error: 'Already a Pro member' });
    return;
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'PromptX Pro — Lifetime Access',
              description: 'Unlock all AI prompts forever. One-time payment, no subscription.',
              images: [],
            },
            unit_amount: PRO_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/cancel`,
      metadata: {
        userId: String(req.userId!),
        type: 'pro',
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

paymentsRouter.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!webhookSecret || webhookSecret.includes('YOUR_WEBHOOK')) {
    res.json({ received: true });
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature failed:', err);
    res.status(400).json({ error: 'Webhook error' });
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.metadata?.type === 'pro') {
      await fulfillPro(Number(session.metadata.userId), session.id);
    }
  }

  res.json({ received: true });
});

paymentsRouter.get('/verify-pro/:sessionId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    if (session.payment_status === 'paid' && session.metadata?.type === 'pro') {
      if (Number(session.metadata.userId) !== req.userId!) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
      await fulfillPro(req.userId!, session.id);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch {
    res.status(400).json({ error: 'Invalid session' });
  }
});

async function fulfillPro(userId: number, sessionId: string): Promise<void> {
  await Promise.all([
    supabase.from('users').update({ is_pro: true }).eq('id', userId),
    supabase.from('pro_purchases').upsert(
      { user_id: userId, stripe_session_id: sessionId, amount_cents: PRO_PRICE_CENTS },
      { onConflict: 'stripe_session_id' }
    ),
  ]);
}

import crypto from 'crypto';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function verifyWebhook(req: Request) {
  const headersList = headers();
  const shopifyHash = headersList.get('x-shopify-hmac-sha256');

  if (!shopifyHash) {
    console.error('No HMAC header, cannot be verified.');
    return false;
  }

  const rawBody = await req.clone().text();
  const actualHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOKS_SIGNATURE as string)
    .update(rawBody)
    .digest('base64');

  if (shopifyHash === actualHash) return true;

  console.error('Unverified shopify webhook');
  return NextResponse.json({ error: 'Unverified shopify webhook' }, { status: 403 });
}

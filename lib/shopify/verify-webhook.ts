import crypto from 'crypto';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function verifyShopifyWebhook(req: NextRequest): Promise<boolean | NextResponse> {
  if (process.env.NODE_ENV === 'development') {
    console.log('Development environment: Skipping webhook verification');
    return true;
  }

  const headersList = headers();
  const shopifyHash = headersList.get('x-shopify-hmac-sha256');

  if (!shopifyHash) {
    console.error('No HMAC header, cannot be verified.');
    return NextResponse.json({ error: 'Missing HMAC header' }, { status: 400 });
  }

  const rawBody = await req.clone().text();
  const actualHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOKS_SIGNATURE || '')
    .update(rawBody)
    .digest('base64');

  if (shopifyHash === actualHash) {
    return true;
  }

  console.error('Unverified Shopify webhook');
  return NextResponse.json({ error: 'Unverified Shopify webhook' }, { status: 200 });
}

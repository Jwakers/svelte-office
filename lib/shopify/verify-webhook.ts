import crypto from 'crypto';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function verifyWebhook(req: NextRequest) {
  const headersList = headers();
  const shopifyHash = headersList.get('x-shopify-hmac-sha256');

  if (!shopifyHash) {
    throw Error('No HMAC header, cannot be verified.');
  }

  const rawBody = await req.clone().text();
  const actualHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOKS_SIGNATURE as string)
    .update(rawBody)
    .digest('base64');

  if (shopifyHash === actualHash) return true;

  console.error('Unverified shopify webhook');
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  return NextResponse.json({ error: 'Unverified shopify webhook' }, { status: 200 });

  // Simpler alternate method to verify the webhook
  const secret = req.nextUrl.searchParams.get('secret');

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }
}

import { getAlgoliaIndex, getRecord } from 'lib/algolia';
import { getProductForAlgolia } from 'lib/shopify';
import { verifyWebhook } from 'lib/shopify/verify-webhook';
import { NextRequest, NextResponse } from 'next/server';

const client = getAlgoliaIndex(true);

export async function POST(req: NextRequest): Promise<Response> {
  verifyWebhook(req);

  try {
    const body = await req.json();
    const product = await getProductForAlgolia(body.id);

    const record = getRecord(product);

    await client.saveObject(record);

    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: 'There was an error', error: err }, { status: 500 });
  }
}

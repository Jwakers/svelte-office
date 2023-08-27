import crypto from 'crypto';
import sendEmail from 'lib/send-email';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const isVerifiedWebhookRequest = async (req: Request) => {
  const headersList = headers();
  const shopifyHash = headersList.get('x-shopify-hmac-sha256');

  // if (process.env.NODE_ENV === 'development') {
  //   // Bypass the webhook signature check
  //   return true;
  // }

  if (!shopifyHash) {
    console.error('No HMAC header, cannot be verified.');
    return false;
  }

  const rawBody = await req.text();
  const actualHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOKS_SIGNATURE as string)
    .update(rawBody)
    .digest('base64');

  return shopifyHash === actualHash;
};

const handleData = (data: any) => {
  const { id, contact_email, email, billing_address, customer, line_items } = data;

  const teknikLineItems = line_items.filter(
    (item: any) => item.vendor === 'Teknik' || item.vendor === null
  );

  const itemsMarkup = teknikLineItems
    .map(
      (item: any) => `
    <table style="margin-bottom: 16px; border-collapse: collapse;">
      <tr style="vertical-align: baseline;">
        <td style="border: 1px solid #d8d8d8; padding: 6px;">Name</td>
        <td style="border: 1px solid #d8d8d8; padding: 6px;">${item.name}</td>
      </tr>
      ${
        item.variant_title
          ? `<tr style="vertical-align: baseline;">
        <td style="border: 1px solid #d8d8d8; padding: 6px;">Variant</td>
        <td style="border: 1px solid #d8d8d8; padding: 6px;">${item.variant_title}</td>
      </tr>`
          : ''
      }
      <tr style="vertical-align: baseline;">
        <td style="border: 1px solid #d8d8d8; padding: 6px;">SKU</td>
        <td style="border: 1px solid #d8d8d8; padding: 6px;">${item.sku}</td>
      </tr>
      <tr style="vertical-align: baseline;">
        <td style="border: 1px solid #d8d8d8; padding: 6px;">Quantity</td>
        <td style="border: 1px solid #d8d8d8; padding: 6px;">${item.quantity}</td>
      </tr>
    </table>
  `
    )
    .join('');

  const customerMarkup = `
  <div>
    <h5>Customer information:</h5>
    <table style="margin-bottom: 16px; border-collapse: collapse;">
      <tr style="vertical-align: baseline;">
        <td style="border: 1px solid #d8d8d8; padding: 6px;">First name</td>
        <td style="border: 1px solid #d8d8d8; padding: 6px;">${customer.first_name}</td>
      </tr>
      <tr style="vertical-align: baseline;">
        <td style="border: 1px solid #d8d8d8; padding: 6px;">Last name</td>
        <td style="border: 1px solid #d8d8d8; padding: 6px;">${customer.last_name}</td>
      </tr>
      <tr style="vertical-align: baseline;">
        <td style="border: 1px solid #d8d8d8; padding: 6px;">Email</td>
        <td style="border: 1px solid #d8d8d8; padding: 6px;">${
          customer.email || contact_email || email
        }</td>
      </tr>
      <tr style="vertical-align: baseline;">
        <td style="border: 1px solid #d8d8d8; padding: 6px;">Address</td>
        <td style="border: 1px solid #d8d8d8; padding: 6px;">
          <div>${billing_address.address1}</div>
          ${billing_address.address2 ? `<div>${billing_address.address2}</div>` : ''}
          <div>${billing_address.city}</div>
          <div>${billing_address.province}</div>
          <div>${billing_address.country}</div>
          <div>${billing_address.zip}</div>
        </td>
      </tr>
    </table>
  </div>
  `;

  const html = `
    ${customerMarkup}
    <h5>Order:</h5>
    ${itemsMarkup}
  `;

  sendEmail({
    subject: `New order #${id}`,
    html,
    fromLabel: 'Svelte Office order'
  });
};

export async function POST(req: Request) {
  const data = await req.clone().json();

  if (!isVerifiedWebhookRequest(req)) {
    return NextResponse.json({ error: 'Unverified shopify webhook' }, { status: 401 });
  }
  handleData(data);
  return NextResponse.json({ status: 200 });
}

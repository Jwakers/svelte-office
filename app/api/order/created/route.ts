import sendEmail from 'lib/send-email';
import { verifyShopifyWebhook } from 'lib/shopify/verify-webhook';
import { NextRequest, NextResponse } from 'next/server';

const handleData = (data: any) => {
  const { id, contact_email, email, billing_address, customer, line_items } = data;

  const ordersByVendor: { [key: string]: any[] } = {};

  for (const item of line_items) {
    const key = item.vendor || 'NO_VENDOR';
    if (Array.isArray(ordersByVendor[key])) {
      ordersByVendor[key]?.push(item);
    } else {
      ordersByVendor[key] = [item];
    }
  }

  if (!ordersByVendor) return console.error('No orders');

  const getMarkup = (items: any): string => {
    return items
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
  };

  const markup = [];

  for (const [key, val] of Object.entries(ordersByVendor)) {
    markup.push({
      vendor: key,
      items: getMarkup(val)
    });
  }

  const customerMarkup = `
  <div>
    <h2>Customer information:</h2>
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

  const itemsMarkup = markup
    .map(
      (vendor) => `
<div>
  <h3>${vendor.vendor}</h3>
  ${vendor.items}
</div>
`
    )
    .join(
      '<div style="borer-bottom: 1px solid black; margin-top: 24px; margin-bottom: 24px;"></div>'
    );

  const html = `
    ${customerMarkup}
    <h2>Order:</h2>
    ${itemsMarkup}
  `;

  sendEmail({
    subject: `New order #${id}`,
    html,
    fromLabel: 'Svelte Office order'
  });
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.clone().json();
    await verifyShopifyWebhook(req);

    handleData(data);
    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}

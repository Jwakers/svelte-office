import { getPublicBaseUrl } from 'lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export async function GET() {
  const baseUrl = getPublicBaseUrl();
  const data = await fetch(`${baseUrl}/api/google-merchant-feed`);

  const rawBody = await data.text();
  console.log(rawBody);

  return new Response(rawBody, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}

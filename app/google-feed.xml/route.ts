import { getPublicBaseUrl } from 'lib/utils';

export async function GET() {
  const baseUrl = getPublicBaseUrl();
  const data = await fetch(`${baseUrl}/api/google-merchant-feed`);

  const rawBody = await data.text();

  return new Response(rawBody, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}

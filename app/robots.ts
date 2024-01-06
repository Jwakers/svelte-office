import { getPublicBaseUrl } from 'lib/utils';

const baseUrl = getPublicBaseUrl();

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*'
      },
      { userAgent: 'Googlebot' },
      {
        userAgent: 'Googlebot-image'
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}

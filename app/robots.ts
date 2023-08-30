import { getPublicBaseUrl } from 'lib/utils';

const baseUrl = getPublicBaseUrl();

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*'
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}

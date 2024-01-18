import { getPublicBaseUrl } from 'lib/utils';

const baseUrl = getPublicBaseUrl();

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/'
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}

import { GoogleAuth } from 'google-auth-library';
import { ReadonlyURLSearchParams } from 'next/navigation';

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const getPublicBaseUrl = () =>
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
    : 'http://localhost:3000';

export async function authenticateGoogleApi() {
  try {
    const auth = await new GoogleAuth({
      keyFile: './svelte-office-4cfac2233c0d.json',
      scopes: ['https://www.googleapis.com/auth/content']
    });

    return auth;
  } catch (error) {
    console.error('Error authenticating with Google API:', error);
    throw error;
  }
}

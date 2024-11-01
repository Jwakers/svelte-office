import clsx, { ClassValue } from 'clsx';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { BREAKPOINTS } from './constants';
import { Product } from './shopify/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const getPublicBaseUrl = () => `https://${process.env.NEXT_PUBLIC_SITE_URL}`;

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getPriceWithMargin(cost: string, marginPercentage: number = 30) {
  const costPrice = parseFloat(cost);

  let sellingPrice = costPrice / (1 - marginPercentage / 100);
  // Round to the nearest 5
  sellingPrice = Math.ceil(sellingPrice / 5) * 5;

  return `${sellingPrice.toFixed(2)}`;
}

export function getNextPageUrl(linkHeader: string | null) {
  if (!linkHeader) {
    return null;
  }

  const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
  return match ? match[1] : null;
}

export function parseHyphen(label: string) {
  return label.split('-').join(' ');
}

export function parseUnderscore(label: string) {
  return label.split('_').join(' ');
}

type BreakpointKeys = keyof typeof BREAKPOINTS;

export function getImageSizes(sizes: { [key in BreakpointKeys]?: string }) {
  const pairs = Object.entries(sizes);

  return pairs.reduce((acc, [key, val], i) => {
    if (i < pairs.length - 1)
      acc += `(max-width: ${BREAKPOINTS[key as BreakpointKeys] - 1}px) ${val}, `;
    else acc += val;
    return acc;
  }, '');
}

export const getMetafieldValue = (
  product: Product,
  key: 'width' | 'depth' | 'height' | 'weight'
): string | undefined => {
  const metafield = product[key];
  if (!metafield) return undefined;
  return metafield ? JSON.parse(metafield.value).value : undefined;
};

export async function verifyRecaptcha(token: string) {
  const url = 'https://www.google.com/recaptcha/api/siteverify';

  const params = new URLSearchParams();
  params.append('secret', process.env.RECAPTCHA_SECRET_KEY!);
  params.append('response', token);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    const score = await res.json();

    if (!score.success) {
      throw {
        type: 'RECAPTCHA_ERROR',
        message: 'ReCAPTCHA error',
        error: score['error-codes'].join(', ')
      };
    }
  } catch (err) {
    console.error('Error verifying ReCAPTCHA:', err);
    throw {
      type: 'RECAPTCHA_ERROR',
      message: 'ReCAPTCHA error',
      error: 'ReCAPTCHA error'
    };
  }
}

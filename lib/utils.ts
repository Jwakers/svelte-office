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

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getPriceWithMargin(cost: string, marginPercentage: number = 30) {
  const costPrice = parseFloat(cost);

  let sellingPrice = costPrice / (1 - marginPercentage / 100);
  // Round to the nearest 10
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

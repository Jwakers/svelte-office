import { ProductReviewsResponse } from './types';

export async function getYotpoAccessToken() {
  const options = {
    method: 'POST',
    headers: { accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.YOTPO_STORE_ID,
      client_secret: process.env.YOTPO_API_KEY
    })
  };

  const res = await fetch('https://api.yotpo.com/oauth/token', options);
  const data: { access_token: string; token_type: string } = await res.json();

  return data;
}

export async function getReviews(productId: string): Promise<ProductReviewsResponse> {
  const url = `https://api-cdn.yotpo.com/v1/widget/${process.env.YOTPO_STORE_ID}/products/${productId}/reviews.json`;
  const options = {
    method: 'GET',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    if (data.errors) {
      throw data.errors[0];
    }

    return data;
  } catch (err) {
    throw {
      error: err
    };
  }
}

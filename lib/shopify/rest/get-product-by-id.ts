import { ROUTES } from 'lib/constants';
import getRestClient from './get-rest-client';
import { Product } from './types';

const client = getRestClient();

export default async function getProductById(id: string): Promise<Product> {
  const response = await client.get(`${ROUTES.products}/${id}`);
  const data: { product: Product } = await response.json();

  return data.product;
}

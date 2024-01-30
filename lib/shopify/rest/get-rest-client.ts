import { createAdminRestApiClient } from '@shopify/admin-api-client';

export default function getRestClient() {
  const client = createAdminRestApiClient({
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN as string,
    accessToken: process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN as string,
    apiVersion: '2023-04'
  });

  return client;
}

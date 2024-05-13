import { getCollections, getPages } from 'lib/shopify';
import getAllOfType from 'lib/shopify/rest/get-all-of-type';
import { Product } from 'lib/shopify/rest/types';
import { getPublicBaseUrl } from 'lib/utils';
import { MetadataRoute } from 'next';

const baseUrl = getPublicBaseUrl();

export default async function sitemap(): Promise<Promise<Promise<MetadataRoute.Sitemap>>> {
  const routesMap = ['', '/contact', '/search'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  const collectionsPromise = getCollections().then((collections) =>
    collections.map((collection) => ({
      url: `${baseUrl}/search?refinementList%5Bcollections%5D%5B0%5D=${collection.handle}`,
      lastModified: collection.updatedAt
    }))
  );

  const productsPromise = getAllOfType<Product>('products').then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/products/${product.handle}`,
      lastModified: product.updated_at
    }))
  );

  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      url: `${baseUrl}/${page.handle}`,
      lastModified: page.updatedAt
    }))
  );

  const fetchedRoutes = (
    await Promise.all([collectionsPromise, productsPromise, pagesPromise])
  ).flat();

  return [...routesMap, ...fetchedRoutes];
}

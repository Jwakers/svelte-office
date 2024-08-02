import { productFragment } from '../fragments/product';
import seoFragment from '../fragments/seo';

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    descriptionHtml
    image {
      url
      altText
      width
      height
    }
    seo {
      ...seo
    }
    updatedAt
    hide: metafield(namespace: "collection", key: "hide") {
      value
    }
  }
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collectionByHandle(handle: $handle) {
      ...collection
    }
  }
  ${collectionFragment}
  ${seoFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: ID) {
      edges {
        node {
          ...collection
          products(first: 100) {
            edges {
              node {
                handle
                tags
              }
            }
          }
        }
      }
    }
  }
  ${collectionFragment}
  ${seoFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collectionByHandle(handle: $handle) {
      products(sortKey: $sortKey, reverse: $reverse, first: 100) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;

export const getCollectionWithProductsQuery = /* GraphQL */ `
  query getCollectionWithProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $limit: Int
  ) {
    collectionByHandle(handle: $handle) {
      ...collection
      products(sortKey: $sortKey, reverse: $reverse, first: $limit) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${collectionFragment}
  ${productFragment}
`;

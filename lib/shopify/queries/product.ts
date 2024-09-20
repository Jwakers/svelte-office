import { productAlgolia, productFragment } from '../fragments/product';

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String, $limit: Int) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: $limit) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;

export const getGenericFileQuery = /* GraphQL */ `
  query getGenericFile($id: ID!) {
    node(id: $id) {
      ... on GenericFile {
        url
      }
    }
  }
`;

export const getProductTagsQuery = /* GraphQL */ `
  query {
    productTags(first: 20) {
      edges {
        node
      }
    }
  }
`;

export const getProductsForAlgoliaQuery = /* GraphQL */ `
  query getProductsForAlgoliaQuery($after: String) {
    products(first: 100, after: $after) {
      edges {
        node {
          ...productAlgolia
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${productAlgolia}
`;

export const getProductForAlgoliaQuery = /* GraphQL */ `
  query getProduct($id: ID!) {
    product(id: $id) {
      ...productAlgolia
    }
  }
  ${productAlgolia}
`;

export const getProductSkusQuery = /* GraphQL */ `
  query getProductSkus($query: String, $after: String) {
    productVariants(first: 250, query: $query, after: $after) {
      edges {
        node {
          sku
          id
          inventoryQuantity
          inventoryItem {
            id
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const googleMerchantFeedDataQuery = /* GraphQL */ `
  {
    products(first: 250) {
      edges {
        node {
          id
          title
          description
          handle
          vendor
          updatedAt
          priceRangeV2 {
            maxVariantPrice {
              amount
              currencyCode
            }
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
          }
          images(first: 10) {
            edges {
              node {
                __typename
                url
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                __typename
                sku
                displayName
                availableForSale
                price
                barcode
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                }
              }
            }
          }
          width: metafield(namespace: "specification", key: "width") {
            value
          }
          depth: metafield(namespace: "specification", key: "depth") {
            value
          }
          height: metafield(namespace: "specification", key: "height") {
            value
          }
          weight: metafield(namespace: "specification", key: "weight") {
            value
          }
          productCategory {
            productTaxonomyNode {
              fullName
            }
          }
        }
      }
    }
  }
`;

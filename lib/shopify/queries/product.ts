import productFragment from '../fragments/product';

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

export const getProductSkusQuery = /* GraphQL */ `
  query getProductSkus {
    productVariants(first: 250) {
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
    }
  }
`;

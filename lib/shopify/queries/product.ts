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

export const getProductImagesQuery = /* GraphQL */ `
  query getProductImages {
    products(first: 250) {
      edges {
        node {
          id
          title
          images(first: 25) {
            edges {
              node {
                url
                id
                altText
              }
            }
          }
        }
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
          length: metafield(namespace: "specification", key: "length") {
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

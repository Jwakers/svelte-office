import imageFragment from './image';
import seoFragment from './seo';

export const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    vendor
    deliveryType: metafield(namespace: "custom", key: "delivery_type") {
      value
    }
    specification: metafields(
      identifiers: [
        { namespace: "specification", key: "width" }
        { namespace: "specification", key: "depth" }
        { namespace: "specification", key: "height" }
        { namespace: "specification", key: "weight" }
      ]
    ) {
      key
      value
    }
    specificationSheet: metafield(namespace: "specification", key: "specification_sheet") {
      key
      value
    }
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export const productAlgolia = /* GraphQL */ `
  fragment productAlgolia on Product {
    id
    handle
    description
    vendor
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    title
    tags
    featuredImage {
      url
      altText
      width
      height
    }
    options {
      name
      values
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
    variants(first: 100) {
      edges {
        node {
          price {
            amount
            currencyCode
          }
        }
      }
    }
    collections(first: 10) {
      edges {
        node {
          handle
          title
        }
      }
    }
  }
`;

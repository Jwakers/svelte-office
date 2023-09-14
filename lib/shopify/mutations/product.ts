export const inventorySetOnHandQuantitiesMutation = /* GraphQL */ `
  mutation inventorySetOnHandQuantities($input: InventorySetOnHandQuantitiesInput!) {
    inventorySetOnHandQuantities(input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`;

export const updateProductImageAltQuery = /* GraphQL */ `
  mutation productImageUpdate($productId: ID!, $image: ImageInput!) {
    productImageUpdate(productId: $productId, image: $image) {
      image {
        id
        altText
      }
      userErrors {
        field
        message
      }
    }
  }
`;

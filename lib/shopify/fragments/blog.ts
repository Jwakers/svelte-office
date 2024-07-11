export const articleFragment = /* GraphQL */ `
  fragment article on Article {
    excerpt
    handle
    title
    publishedAt
    image {
      ...image
    }
    contentHtml
    authorV2 {
      name
    }
  }
`;

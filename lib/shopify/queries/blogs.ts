import { articleFragment } from '../fragments/blog';
import imageFragment from '../fragments/image';

export const getArticleByHandleQuery = /* GraphQL */ `
  query getArticleByHandle($handle: String!) {
    articles(first: 1, query: $handle) {
      edges {
        node {
          ...article
        }
      }
    }
  }
  ${articleFragment}
  ${imageFragment}
`;

export const getArticlesQuery = /* GraphQL */ `
  query {
    articles(first: 250) {
      edges {
        node {
          ...article
        }
      }
    }
  }
  ${articleFragment}
  ${imageFragment}
`;

export const getArticleByHandleQuery = /* GraphQL */ `
  query getArticleByHandle($handle: String!) {
    articles(first: 1, query: $handle) {
      edges {
        node {
          excerpt
          handle
          title
          publishedAt
          image {
            altText
            height
            id
            url
            width
          }
          contentHtml
          authorV2 {
            name
          }
        }
      }
    }
  }
`;

export const getBlogsQuery = /* GraphQL */ `
  query getBlogs {
    blogs(first: 100) {
      edges {
        node {
          articles(first: 100) {
            edges {
              node {
                excerpt
                handle
                title
                image {
                  altText
                  height
                  id
                  url
                  width
                }
                contentHtml
                authorV2 {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

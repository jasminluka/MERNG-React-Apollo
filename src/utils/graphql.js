import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      username
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
      likes {
        username
      }
      likeCount
      createdAt
    }
  }
`;
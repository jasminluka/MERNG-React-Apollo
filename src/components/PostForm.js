import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { useForm } from '../hooks/hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

const PostForm = () => {
  const initialState = {
    body: ''
  }

  const { values, onChange, onSubmit } = useForm(initialState, createPostCallback);

  const [ createPost, { error } ] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update: (proxy, result) => {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      // Our data is in getPosts array
      // Add newest post to the array
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [result.data.createPost, ...data.getPosts]}
      });
      values.body = '';
    },
    onError: err => {}
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            type="text"
            placeholder="Hi world"
            name="body"
            value={values.body}
            onChange={onChange}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">Submit</Button>
        </Form.Field>
      </Form>
      {
        error && (
          <div className="ui error message" style={{ marginBottom: 20 }}>
            <ul className="list">
              <li>{error.graphQLErrors[0].message}</li>
            </ul>
          </div>
        )
      }
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($body: String!) {
    createPost(body: $body) {
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
        id
        username
        createdAt
      }
      likeCount
      createdAt
    }
  }
`;

export default PostForm;
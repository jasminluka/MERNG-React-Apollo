import React, { useState } from 'react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import MyPopup from './MyPopup';
import { FETCH_POSTS_QUERY } from '../utils/graphql';


const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [ deletePostOrComment ] = useMutation(mutation, {
    variables: { postId, commentId },
    update: (proxy) => {
      setConfirmOpen(false);
      if (!commentId) {
        // Remove post from cache
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        });

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: { getPosts: data.getPosts.filter(post => post.id !== postId) }
        });
      }

      if (callback) {
        callback();
      }
    },
    onError: err => {}
  });


  return (
    <>
      <MyPopup
        content={commentId ? "Delete Comment" : "Delete Post"}
      >
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

// Since the post is already saved on cache the apollo client will look for the post with that id on cache and update it - delete comment.
// ID OF POST MUST BE RETURNED IN ORDER TO WORK
const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;

export default DeleteButton;
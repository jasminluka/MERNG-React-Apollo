import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Label, Icon } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import MyPopup from './MyPopup';


const LikeButton = ({ user, post: { id, likes, likeCount } }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
    }
    else {
      setLiked(false);
    }
  }, [user, likes]);


  const [ likePost ] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    onError: err => {}
  });


  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button color="teal" basic as={Link} to="/login">
      <Icon name="heart" />
    </Button>
  )

  return (
    <MyPopup content={liked ? 'Unlike' : 'Like'}>
      <Button
        as="div"
        labelPosition="right"
        onClick={likePost}
      >
        {likeButton}
        <Label basic color="teal" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </MyPopup>
  );
}


// Since the post is already saved on cache the apollo client will look for the post with that id on cache and update it- like or unlike.
// ID OF POST MUST BE RETURNED IN ORDER TO WORK
const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
        createdAt
      }
      likeCount
    }
  }
`;

export default LikeButton;
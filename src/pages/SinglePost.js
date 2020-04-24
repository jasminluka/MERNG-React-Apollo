import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/auth';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Grid, Card, Form, Image, Button, Icon, Label } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import moment from 'moment';

import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../components/MyPopup';


const SinglePost = () => {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const commentInputRef = useRef(null);

  const { postId } = useParams();
  const history = useHistory();

  const { data: { getPost: post } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: { postId }
  });

  const [ addComment, { error } ] = useMutation(ADD_COMMENT_MUTATION, {
    variables: { postId, body: comment },
    update: () => {
      setComment('');
      commentInputRef.current.blur();
    },
    onError: err => {}
  });


  const deletePostCallback = () => {
    history.push('/');
  }


  let postMarkup;

  if (!post) {
    postMarkup = <p>Loading post...</p>
  }
  else {
    const { id, body, username, comments, commentCount, likes, likeCount, createdAt } = post;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr/>
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                {
                  user ? (
                    <MyPopup
                      content="Comment on post"
                    >
                      <Button
                        as="div"
                        labelPosition="right"
                        onClick={() => commentInputRef.current.focus()}
                      >
                        <Button basic color="blue">
                          <Icon name="comments" />
                        </Button>
                        <Label basic color="blue" pointing="left">{commentCount}</Label>
                      </Button>
                    </MyPopup>
                  ) : (
                    <MyPopup
                      content="Comment on post"
                    >
                      <Button
                        as={Link}
                        to="/login"
                        labelPosition="right"
                      >
                        <Button basic color="blue">
                          <Icon name="comments" />
                        </Button>
                        <Label basic color="blue" pointing="left">{commentCount}</Label>
                      </Button>
                    </MyPopup>
                  )
                }
                
                {
                  user && user.username === username && (
                    <DeleteButton postId={id} callback={deletePostCallback} />
                  )
                }
              </Card.Content>
            </Card>
            {
              user && (
                <Card fluid>
                  <Card.Content>
                    <p>Post a comment</p>
                    <Form>
                      <div className="ui action input fluid">
                        <input
                          type="text"
                          name="comment"
                          placeholder="Comment..."
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                          ref={commentInputRef}
                        />
                        <button
                          type="submit"
                          className="ui button teal"
                          disabled={comment.trim() === ''}
                          onClick={addComment}
                        >
                          Comment
                        </button>
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              )
            }
            {
              comments.map(comment => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {
                      user && user.username === comment.username && (
                        <DeleteButton postId={id} commentId={comment.id} />
                      )
                    }
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              ))
            }
            {
              error && (
                <div className="ui error message" style={{ marginBottom: 20 }}>
                  <ul className="list">
                    <li>{error.graphQLErrors[0].message}</li>
                  </ul>
                </div>
              )
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }


  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query FetchPost($postId: ID!) {
    getPost(postId: $postId) {
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

// Since the post is already saved on cache the apollo client will look for the post with that id on cache and update it - add comment.
// ID OF POST MUST BE RETURNED IN ORDER TO WORK
const ADD_COMMENT_MUTATION = gql`
  mutation AddComment($postId: ID!, $body: String!) {
    addComment(postId: $postId, body: $body) {
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

export default SinglePost;
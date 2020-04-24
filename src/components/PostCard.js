import React, { useContext } from 'react';
import { AuthContext } from '../context/auth';
import { Link } from 'react-router-dom';
import { Card, Image, Button, Icon, Label } from 'semantic-ui-react';
import moment from 'moment';

import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from './MyPopup';


const PostCard = ({ id, body, username, commentCount, likes, likeCount, createdAt }) => {

  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta
          as={Link}
          to={`/posts/${id}`}
        >
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>

        <LikeButton user={user} post={{ id, likes, likeCount }} />

        <MyPopup
          content="Comment on post"
        >
          <Button
            labelPosition="right"
            as={Link}
            to={`/posts/${id}`}
          >
            <Button color="blue" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        
        {
          user && user.username === username && <DeleteButton postId={id} />
        }
      </Card.Content>
    </Card>
  );
}

export default PostCard;
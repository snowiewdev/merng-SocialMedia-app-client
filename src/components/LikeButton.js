import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, Label, Icon, Popup } from 'semantic-ui-react';

function LikeButton({ user, post: { id, likes, likeCount}}){
  const [liked, setLiked] = useState(false);

  //if user liked post before, setliked to true
  useEffect(()=>{
    if (user && likes.find(like => like.username === user.username)){
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  })

  const likeButton = user ? (
      liked ? ( //filled button
        <Button color='red'>
          <Icon name='heart'/>
        </Button>
      ) : (
        <Button color='red' basic> 
          <Icon name='heart' />
        </Button>
      ) //outlined button
    ) : (
      <Button as={Link} to="/login" color='red' basic>
          <Icon name='heart' />
        </Button>
    ) // logged out user will only see outlined button

  return(
    <Button as='div' labelPosition='right' onClick={likePost}>
      <Popup
        content={liked ? "Unlike" : "Like"}
        size="mini" inverted position='top center'
        trigger={ likeButton }
      />
    <Label basic color='red' pointing='left'>
      { likeCount }
    </Label>
  </Button>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!){
    likePost(postId: $postId){
      id
      likes{
        id username
      }
      likeCount
    }
  }
`;

export default LikeButton;
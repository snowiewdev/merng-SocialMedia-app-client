import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../utils/graphql';

function DeleteButton({ postId, commentId, callback}){

  const [ confirmOpen, setConfirmOpen ] = useState(false); //confirm box open or not

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [ deletePostOrComment ] = useMutation(mutation, {
    update(proxy){ // used to ask user if he's sure for deleting 
      setConfirmOpen(false); //after deleting, close confirm window

      if (!commentId) { //delete post needs to redirect to home page
        //clear the cache & update posts page => show the updatest posts
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        });
        let temp = data.getPosts.filter((p) => p.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: {getPosts: temp} });
      } 

      if (callback) callback();
    },
    variables: { postId, commentId }
  });

  return(
    <>
      <Popup 
        content={commentId ? 'Delete comment' : 'Delete post'}
        size="mini" inverted position='top center'
        trigger={
          <Button basic 
            as="div" 
            color="grey" 
            floated="right" 
            onClick={()=> setConfirmOpen(true)}
          >
            <Icon name="trash" style={{margin: 0}}/>
          </Button>
        }
      />
      <Confirm 
        open={confirmOpen} 
        onCancel={()=> setConfirmOpen(false)} 
        onConfirm={deletePostOrComment}
        />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!){
    deleteComment(postId: $postId, commentId: $commentId){
      id
      comments{
        id username body createdAt 
        likes { username }
      }
      commentCount
    }
  }
`;

export default DeleteButton;
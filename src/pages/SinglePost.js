import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Card, Form, Grid, Image, Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom'; 
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

function SinglePost(props){
  
  const { user } = useContext(AuthContext); //login status
  const postId = props.match.params.postId; //get postId from url
  const commentInputRef = useRef(null);

  const [ comment, setComment ] = useState('');

  //get single post
  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  //create new comment
  const [ submitComment ] = useMutation(SUBMIT_COMMENT, {
    update(){
      setComment('');
      commentInputRef.current.blur();
    }, 
    variables: {
      postId,
      body: comment
    }
  })


  // redirect to main page after delete post
  function deletePostCallback(){
    props.history.push('/'); 
  }

  
  let postMarkup;

  if (!getPost){
    postMarkup = <p> Loading post...</p>
  } else {
    const { id, username, body, createdAt, likes, likeCount, comments, commentCount} = getPost;

    postMarkup = (
      <Grid className="content-container">
        <Grid.Row>
          <Grid.Column width={2}>
            <Image src="https://react.semantic-ui.com/images/avatar/large/molly.png" size="small" float="right" />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header> {username} </Card.Header>
                <Card.Meta> {moment(createdAt).fromNow()} </Card.Meta>
                <Card.Description> {body} </Card.Description>
              </Card.Content>
              <hr/>
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes}} />
                {user ? (
                  <Button as="div" labelPosition="right" onClick={()=> console.log('comment')}>
                    <Button basic color="teal">
                      <Icon name="comments"/>
                    </Button>
                    <Label basic color="teal" pointing="left"> 
                        { commentCount } 
                    </Label>
                </Button>
                ) : (
                  <Button as={Link} to="/login" labelPosition="right">
                    <Button basic color="teal">
                      <Icon name="comments"/>
                    </Button>
                    <Label basic color="teal" pointing="left"> 
                        { commentCount } 
                    </Label>
                  </Button>
                )}
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p> Reply Post </p>
                  <Form>
                    <div className="ui action input field">
                      <input 
                        type="text" 
                        placeholder="Comment..." 
                        name="comment" 
                        value={comment} 
                        onChange={event => setComment(event.target.value)}
                        ref={commentInputRef}
                        />
                      <button 
                        type="submit" 
                        className="ui button teal" 
                        disabled={comment.trim() === ''} 
                        onClick={submitComment}>
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id}/>
                  )}
                  <Card.Header> {comment.username} </Card.Header>
                  <Card.Meta> {moment(comment.createdAt).fromNow()} </Card.Meta>
                  <Card.Description> {comment.body} </Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return postMarkup;
}

const FETCH_POST_QUERY = gql `
  query($postId: ID!){
    getPost(postId: $postId){
      id username body createdAt
      likes{ username }
      likeCount
      comments{
        id username body createdAt likes{ username }
      }
      commentCount
    }
  }
`;

const SUBMIT_COMMENT = gql`
  mutation ($postId: ID! $body: String!){
    createComment(postId: $postId, body: $body){
      id
      comments{
        id username body createdAt likes { username }
      }
      commentCount
    }
  }
`;

export default SinglePost;
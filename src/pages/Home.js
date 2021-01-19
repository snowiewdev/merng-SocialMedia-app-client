import React, {useContext} from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

function Home(){
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts} = {}} = useQuery(FETCH_POSTS_QUERY);

  return(
    <div>
      <Grid stackable columns={3}>
        <Grid.Row className="page-title">
          <h1> Recent Posts </h1>
        </Grid.Row>
        <Grid.Row>
          {user && (
            <Grid.Column>
              <PostForm />
            </Grid.Column>
          )}
          {loading ? (
            <h1> loading... </h1>
          ) : (
            posts && posts.map(post => (
              <Transition.Group>
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              </Transition.Group>
            ))
          )}
        </Grid.Row>
        <Grid.Row>
          <p> Welcome to WestWorld Circle </p>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default Home;
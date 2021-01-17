import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from 'apollo-link-context'; // used to add token to authorization header automatically to each http request

const httpLink = createHttpLink({
  uri: 'https://stormy-ravine-32306.herokuapp.com/'
});

const authLink = setContext(()=>{
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>
);
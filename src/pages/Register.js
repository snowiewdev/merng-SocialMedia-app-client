import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';

function Register(props){
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  // use addUser as callback & pass initialState 
  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }); 

  const [addUser, {loading}] = useMutation(REGISTER_USER, {
      update(_, {data: { register: userData }}){
        context.login(userData);
        props.history.push('/');
      },
      onError(err){
        setErrors(err.graphQLErrors[0].extensions.exception.errors);
      },
      variables: values
    });

  function registerUser(){
    addUser();
  }

  return(
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : "" }>
        <h1> Register </h1>
        <Form.Input
          label="Username"
          placeholder="username"
          name="username"
          type="text"
          values={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="email"
          name="email"
          type="email"
          values={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="password"
          name="password"
          type="password"
          values={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="password"
          name="confirmPassword"
          type="password"
          values={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map(value => (
              <li key={value}> {value} </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ){
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ){
      id username email createdAt token
    }
  }
`;

export default Register;
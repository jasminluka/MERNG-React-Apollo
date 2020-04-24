import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/auth';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { useForm } from '../hooks/hooks';


const Register = (props) => {
  const { login } = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const { values, onChange, onSubmit } = useForm(initialState, registerUser);


  const [ addUser, { loading } ] = useMutation(REGISTER_USER_MUTATION, {
    variables: values,
    // triggered if mutation is successfully executed
    update: (proxy, { data: { register: userData }}) => {
      // result is the mutation or query
      login(userData);
      props.history.push('/');
    },
    onError: err => {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    }
  });

  function registerUser() {
    addUser();
  }
  

  return (
    <div className="form-container">
      <Form
        onSubmit={onSubmit}
        noValidate
        className={loading ? "loading": ""}
      >
        <h1>Register</h1>
        <Form.Input
          type="text"
          label="Username"
          placeholder="Username..."
          name="username"
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
        />
        <Form.Input
          type="email"
          label="Email"
          placeholder="Email..."
          name="email"
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}
        />
        <Form.Input
          type="password"
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
        />
        <Form.Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword ? true : false}
        />

        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {
        Object.keys(errors).length > 0 && (
          <div className="ui error message">
            <ul className="list">
              {Object.values(errors).map(error => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )
      }
    </div>
  );
}

const REGISTER_USER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
    register(registerInput: {
      username: $username,
      email: $email,
      password: $password,
      confirmPassword: $confirmPassword
    }) {
      id
      username
      email
      token
      createdAt
    }
  }
`;

export default Register;
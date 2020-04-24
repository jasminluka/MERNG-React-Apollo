import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/auth';
import { Form, Button } from 'semantic-ui-react';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { useForm } from '../hooks/hooks';


const Login = (props) => {
  const { login } = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    username: '',
    password: ''
  };

  const { values, onChange, onSubmit } = useForm(initialState, loginCallback);


  const [ loginUser, { loading } ] = useLazyQuery(LOGIN_USER_QUERY, {
    // variables: values,
    onCompleted: ({ login: userData }) => {
      login(userData);
      props.history.push('/');
    },
    onError: err => {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    }
  });

  function loginCallback() {
    loginUser({ variables: values });
  }

  // const [ loginUser, { loading } ] = useMutation(LOGIN_USER, {
  //   variables: values,
  //   // triggered if mutation is successfully executed
  //   update: (proxy, result) => {
  //     // result is the mutation or query
  //     login(result.login);
  //     props.history.push('/');
  //   },
  //   onError: err => {
  //     setErrors(err.graphQLErrors[0].extensions.exception.errors);
  //   }
  // });


  // function login() {
  //   loginUser();
  // }

  return (
    <div className="form-container">
      <Form
        onSubmit={onSubmit}
        noValidate
        className={loading ? "loading": ""}
      >
        <h1>Login</h1>
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
          type="password"
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
        />

        <Button type="submit" primary>
          Login
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

const LOGIN_USER_QUERY = gql`
  query Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      token
      createdAt
    }
  }
`;

export default Login;
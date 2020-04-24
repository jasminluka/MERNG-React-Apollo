import React, { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';


const initialState = {
  user: null
}

if (localStorage.getItem('token')) {
  const decodedToken = jwtDecode(localStorage.getItem('token'));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
  }
  else {
    initialState.user = decodedToken;
  }
}

export const AuthContext = createContext({
  user: null,
  login: userData => {},
  logout: () => {}
});

const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null
      }
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = userData => {
    localStorage.setItem('token', userData.token);
    
    dispatch({
      type: 'LOGIN',
      payload: userData
    });
  }

  const logout = () => {
    localStorage.removeItem('token');
    
    dispatch({
      type: 'LOGOUT'
    });
  }

  return (
    <AuthContext.Provider value={{
      user: state.user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}
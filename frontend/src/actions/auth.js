import axios from 'axios';
import { createMessage, returnErrors } from './messages';
import { USER_LOADING, USER_LOADED, AUTH_ERROR, REGISTER_FAIL, REGISTER_SUCCESS, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS } from './types';


// HELPER FUNCTION - TOKEN SETUP
export const tokenConfig = (getState) => {
  const token = getState().auth.token;
  const config = { headers: { 'Content-Type': 'application/json' }, };

  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  return config;
};


export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  axios
    .get('/api/auth/user', tokenConfig(getState))
    .then((res) => {
      dispatch({ type: USER_LOADED, payload: res.data, });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: AUTH_ERROR, });
    });
};


export const login = (username, password) => (dispatch) => {
  const config = { headers: { 'Content-Type': 'application/json' } };

  axios
    .post('/api/auth/login', JSON.stringify({ username, password }), config)
    .then((res) => {
      dispatch({ type: LOGIN_SUCCESS, payload: res.data, });
      dispatch(createMessage({ loginSuccess: 'You have successfully logged in.'}));
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: LOGIN_FAIL, });
    });
};


export const register = (username, email, password) => (dispatch) => {
  const config = { headers: { 'Content-Type': 'application/json' }, };

  axios
    .post('/api/auth/register', JSON.stringify({ username, email, password }), config)
    .then((res) => {
      dispatch({ type: REGISTER_SUCCESS, payload: res.data, });
      dispatch(createMessage({ registerSuccess: 'You have successfully registered and have been logged in.'}));
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: REGISTER_FAIL, });
    });
};


export const logout = () => (dispatch, getState) => {
  axios
    .post('/api/auth/logout', null, tokenConfig(getState))
    .then((res) => {
      dispatch({ type: LOGOUT_SUCCESS, });
      dispatch(createMessage({ logoutSuccess: 'You have successfully logged out.'}));
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};
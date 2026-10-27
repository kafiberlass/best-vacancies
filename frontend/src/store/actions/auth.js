import { api, tokenStorage } from '../../api';
import { AUTH_CHECK_START, AUTH_SUCCESS, AUTH_LOGOUT } from '../actionTypes';

export const authSuccess = (user) => ({ type: AUTH_SUCCESS, payload: user });
export const logout = () => {
  tokenStorage.remove();
  return { type: AUTH_LOGOUT };
};

// При запуске приложения восстанавливаем пользователя по сохранённому токену
export const restoreSession = () => async (dispatch) => {
  if (!tokenStorage.get()) {
    dispatch({ type: AUTH_LOGOUT });
    return;
  }
  dispatch({ type: AUTH_CHECK_START });
  try {
    const { user } = await api.me();
    dispatch(authSuccess(user));
  } catch {
    dispatch(logout());
  }
};

const signIn = (requestFn) => async (dispatch) => {
  const { token, user } = await requestFn();
  tokenStorage.set(token);
  dispatch(authSuccess(user));
  return user;
};

export const login = (credentials) => signIn(() => api.login(credentials));
export const signup = (data) => signIn(() => api.signup(data));

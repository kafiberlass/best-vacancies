import { AUTH_CHECK_START, AUTH_SUCCESS, AUTH_LOGOUT } from '../actionTypes';

// status: 'checking' - пока проверяем сохранённый токен, 'ready' - всё известно
const initialState = { user: null, status: 'checking' };

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_CHECK_START:
      return { ...state, status: 'checking' };
    case AUTH_SUCCESS:
      return { user: action.payload, status: 'ready' };
    case AUTH_LOGOUT:
      return { user: null, status: 'ready' };
    default:
      return state;
  }
}

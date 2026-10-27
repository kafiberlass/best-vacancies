import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/auth';
import vacanciesReducer from './reducers/vacancies';

const rootReducer = combineReducers({
  auth: authReducer,
  vacancies: vacanciesReducer,
});

// redux-thunk позволяет диспатчить асинхронные действия (запросы к API)
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

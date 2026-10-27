// HOC защиты маршрутов: знает, авторизован ли пользователь и какая у него роль,
// и в зависимости от этого показывает страницу или делает редирект
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { selectUser } from '../store/selectors';

// Страница только для вошедших; если указана role - только для этой роли.
// Чужая роль (например, соискатель на /create-vacancy) перенаправляется на /vacancies
export function withAuth(Component, role) {
  function Protected(props) {
    const user = useSelector(selectUser);
    const location = useLocation();

    if (!user) {
      return <Redirect to={{ pathname: '/login', state: { from: location } }} />;
    }
    if (role && user.role !== role) {
      return <Redirect to="/vacancies" />;
    }
    return <Component {...props} />;
  }

  Protected.displayName = `withAuth(${Component.displayName || Component.name})`;
  return Protected;
}

// Страница только для гостей (вход и регистрация): вошедшего пользователя отправляем дальше
export function withGuest(Component) {
  function GuestOnly(props) {
    const user = useSelector(selectUser);
    const location = useLocation();

    if (user) {
      return <Redirect to={location.state?.from || '/vacancies'} />;
    }
    return <Component {...props} />;
  }

  GuestOnly.displayName = `withGuest(${Component.displayName || Component.name})`;
  return GuestOnly;
}

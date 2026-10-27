import { useDispatch } from 'react-redux';
import AuthForm from '../components/AuthForm';
import { login } from '../store/actions/auth';

const FIELDS = [
  { name: 'login', label: 'Логин', autoComplete: 'username' },
  { name: 'password', label: 'Пароль', type: 'password', autoComplete: 'current-password' },
];

const LINKS = [
  { text: 'Впервые в BestVacancies?', to: '/signup', label: 'Создать аккаунт' },
  { text: 'Вы работодатель?', to: '/company-signup', label: 'Зарегистрировать компанию' },
];

function LoginPage() {
  const dispatch = useDispatch();
  // После входа withGuest сам перенаправит на нужную страницу
  return <AuthForm title="Вход" fields={FIELDS} submitText="Войти" links={LINKS} onSubmit={(values) => dispatch(login(values))} />;
}

export default LoginPage;

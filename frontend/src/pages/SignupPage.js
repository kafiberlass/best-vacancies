import { useDispatch } from 'react-redux';
import AuthForm from '../components/AuthForm';
import { signup } from '../store/actions/auth';

const FIELDS = [
  { name: 'login', label: 'Логин', autoComplete: 'username' },
  { name: 'password', label: 'Пароль', type: 'password', autoComplete: 'new-password' },
  { name: 'repeatPassword', label: 'Повторите пароль', type: 'password', autoComplete: 'new-password' },
];

const LINKS = [
  { text: 'Уже есть аккаунт?', to: '/login', label: 'Войти' },
  { text: 'Вы работодатель?', to: '/company-signup', label: 'Зарегистрировать компанию' },
];

// Регистрация соискателя
function SignupPage() {
  const dispatch = useDispatch();
  return (
    <AuthForm
      title="Регистрация соискателя"
      fields={FIELDS}
      submitText="Зарегистрироваться"
      links={LINKS}
      onSubmit={(values) => dispatch(signup({ ...values, role: 'applicant' }))}
    />
  );
}

export default SignupPage;

import { useDispatch } from 'react-redux';
import AuthForm from '../components/AuthForm';
import { signup } from '../store/actions/auth';

const FIELDS = [
  { name: 'companyName', label: 'Название компании', autoComplete: 'organization' },
  { name: 'login', label: 'Логин', autoComplete: 'username' },
  { name: 'password', label: 'Пароль', type: 'password', autoComplete: 'new-password' },
  { name: 'repeatPassword', label: 'Повторите пароль', type: 'password', autoComplete: 'new-password' },
];

const LINKS = [
  { text: 'Уже есть аккаунт?', to: '/login', label: 'Войти' },
  { text: 'Ищете работу?', to: '/signup', label: 'Регистрация соискателя' },
];

// Регистрация компании (работодателя)
function CompanySignupPage() {
  const dispatch = useDispatch();
  return (
    <AuthForm
      title="Регистрация компании"
      fields={FIELDS}
      submitText="Зарегистрироваться"
      links={LINKS}
      onSubmit={(values) => dispatch(signup({ ...values, role: 'employer' }))}
    />
  );
}

export default CompanySignupPage;

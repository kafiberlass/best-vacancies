import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { restoreSession } from './store/actions/auth';
import { selectAuthStatus } from './store/selectors';
import { withAuth, withGuest } from './routes/withAuth';
import { Centered, Muted } from './components/ui';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CompanySignupPage from './pages/CompanySignupPage';
import CreateVacancyPage from './pages/CreateVacancyPage';
import { VacanciesPage, MyVacanciesPage, ActiveVacanciesPage } from './pages/VacanciesPages';

// Защищённые версии страниц (HOC). Второй аргумент - роль, которой страница доступна
const Login = withGuest(LoginPage);
const Signup = withGuest(SignupPage);
const CompanySignup = withGuest(CompanySignupPage);
const Vacancies = withAuth(VacanciesPage);
const MyVacancies = withAuth(MyVacanciesPage, 'applicant');
const ActiveVacancies = withAuth(ActiveVacanciesPage, 'employer');
const CreateVacancy = withAuth(CreateVacancyPage, 'employer');

function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);

  // После перезагрузки страницы восстанавливаем пользователя по сохранённому токену
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (authStatus === 'checking') {
    return (
      <Centered>
        <Muted>Загрузка…</Muted>
      </Centered>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/company-signup" component={CompanySignup} />
      <Route path="/vacancies" component={Vacancies} />
      <Route path="/my-vacancies" component={MyVacancies} />
      <Route path="/active-vacancies" component={ActiveVacancies} />
      <Route path="/create-vacancy" component={CreateVacancy} />
      {/* Главная страница приложения - /vacancies */}
      <Redirect to="/vacancies" />
    </Switch>
  );
}

export default App;

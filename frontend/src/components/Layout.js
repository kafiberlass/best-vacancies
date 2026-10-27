import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/actions/auth';
import { selectUser } from '../store/selectors';
import { ListIcon, CheckListIcon, CreateIcon, LogoutIcon } from './icons';

const NAV = {
  applicant: [
    { to: '/vacancies', label: 'Вакансии', Icon: ListIcon },
    { to: '/my-vacancies', label: 'Мои вакансии', Icon: CheckListIcon },
  ],
  employer: [
    { to: '/vacancies', label: 'Вакансии', Icon: ListIcon },
    { to: '/active-vacancies', label: 'Активные вакансии', Icon: CheckListIcon },
    { to: '/create-vacancy', label: 'Создать вакансию', Icon: CreateIcon },
  ],
};

const Shell = styled.div`
  display: flex;
  min-height: 100vh;

  ${({ theme }) => theme.mobile} {
    flex-direction: column;
  }
`;

const Sidebar = styled.nav`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  width: 150px;
  height: 100vh;
  padding: 20px 10px;
  background: ${({ theme }) => theme.colors.sidebar};
  border-right: 1px solid ${({ theme }) => theme.colors.border};

  ${({ theme }) => theme.mobile} {
    position: static;
    flex-direction: row;
    width: 100%;
    height: auto;
    padding: 6px 8px;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Brand = styled.div`
  margin-bottom: 14px;
  font-weight: 800;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};

  small {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.muted};
    overflow-wrap: anywhere;
  }

  ${({ theme }) => theme.mobile} {
    display: none;
  }
`;

const navItemStyles = ({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  font: inherit;
  font-size: 13px;
  text-align: center;
  text-decoration: none;
  color: ${theme.colors.text};
  background: none;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background: ${theme.colors.background};
  }
`;

const NavItem = styled(NavLink)`
  ${navItemStyles}

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }

  ${({ theme }) => theme.mobile} {
    flex: 1 0 auto;
    padding: 6px 10px;
  }
`;

const LogoutButton = styled.button`
  ${navItemStyles}
  margin-top: auto;

  ${({ theme }) => theme.mobile} {
    margin-top: 0;
    margin-left: auto;
    padding: 6px 10px;
  }
`;

const Content = styled.main`
  flex: 1;
  min-width: 0;
  padding: 24px;

  ${({ theme }) => theme.mobile} {
    padding: 16px;
  }
`;

function Layout({ children }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  return (
    <Shell>
      <Sidebar aria-label="Главное меню">
        <Brand>
          BestVacancies
          <small>{user.role === 'employer' ? user.companyName : user.login}</small>
        </Brand>
        {NAV[user.role].map(({ to, label, Icon }) => (
          <NavItem key={to} to={to}>
            <Icon />
            {label}
          </NavItem>
        ))}
        <LogoutButton type="button" onClick={() => dispatch(logout())}>
          <LogoutIcon />
          Выйти
        </LogoutButton>
      </Sidebar>
      <Content>{children}</Content>
    </Shell>
  );
}

export default Layout;

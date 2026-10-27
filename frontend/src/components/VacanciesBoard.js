import { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Link, useRouteMatch } from 'react-router-dom';
import Layout from './Layout';
import VacancyCard from './VacancyCard';
import VacancyDetails from './VacancyDetails';
import { loadVacancies } from '../store/actions/vacancies';
import { selectList } from '../store/selectors';
import { ErrorMessage, Muted, PageTitle } from './ui';

const Split = styled.div`
  display: grid;
  grid-template-columns: ${({ $withDetails }) => ($withDetails ? 'minmax(260px, 2fr) 3fr' : '1fr')};
  gap: 24px;
  align-items: start;

  ${({ theme }) => theme.mobile} {
    grid-template-columns: 1fr;
  }
`;

const List = styled.div`
  display: grid;
  gap: 14px;

  /* На телефоне при открытой вакансии список прячем - остаётся ссылка "назад" */
  ${({ theme }) => theme.mobile} {
    display: ${({ $hideOnMobile }) => ($hideOnMobile ? 'none' : 'grid')};
  }
`;

const DetailsColumn = styled.div`
  position: sticky;
  top: 24px;

  ${({ theme }) => theme.mobile} {
    position: static;
  }
`;

const BackLink = styled(Link)`
  display: none;
  margin-bottom: 12px;
  font-weight: 600;

  ${({ theme }) => theme.mobile} {
    display: inline-block;
  }
`;

// Общий экран "список вакансий + выбранная вакансия".
// Используется для /vacancies, /my-vacancies и /active-vacancies:
// по адресу /<раздел>/:id справа (вложенный маршрут) открывается сама вакансия
function VacanciesBoard({ title, list, emptyText, detailsProps }) {
  const dispatch = useDispatch();
  const { path, url } = useRouteMatch();
  const detailsMatch = useRouteMatch(`${path}/:id`);
  const { items, status, error } = useSelector(selectList(list));

  useEffect(() => {
    dispatch(loadVacancies(list));
  }, [dispatch, list]);

  const withDetails = Boolean(detailsMatch);

  return (
    <Layout>
      <PageTitle>{title}</PageTitle>
      <Split $withDetails={withDetails}>
        <List $hideOnMobile={withDetails}>
          {status === 'loading' && items.length === 0 && <Muted>Загрузка…</Muted>}
          {status === 'error' && <ErrorMessage>{error}</ErrorMessage>}
          {status === 'ready' && items.length === 0 && <Muted>{emptyText}</Muted>}
          {items.map((vacancy) => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} to={`${url}/${vacancy.id}`} />
          ))}
        </List>

        <Switch>
          <Route path={`${path}/:id`}>
            <DetailsColumn>
              <BackLink to={url}>← Назад к списку</BackLink>
              <VacancyDetails {...detailsProps} />
            </DetailsColumn>
          </Route>
        </Switch>
      </Split>
    </Layout>
  );
}

export default VacanciesBoard;

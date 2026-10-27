import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { loadVacancy, setResponded, closeVacancy } from '../store/actions/vacancies';
import { selectCurrentVacancy, selectUser } from '../store/selectors';
import { Button, Chip, ChipList, ErrorMessage, Muted, Panel } from './ui';

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 26px;
`;

const Description = styled.div`
  max-width: 560px;
  margin-bottom: 28px;
  padding: 20px;
  white-space: pre-wrap;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: 0 6px 14px rgba(120, 70, 160, 0.2);
`;

const SectionTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 20px;
`;

const Section = styled.section`
  margin-bottom: 22px;
`;

const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

const Status = styled.span`
  font-weight: 700;
  color: ${({ theme, $tone }) => ($tone === 'success' ? theme.colors.success : theme.colors.muted)};
`;

// requireOwner - страница "Активная вакансия": показываем только вакансии этого работодателя.
// leaveTo - куда уйти после отмены отклика на странице "Мои вакансии"
function VacancyDetails({ requireOwner = false, leaveTo }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(selectUser);
  const { item: vacancy, id: loadedId, status, error } = useSelector(selectCurrentVacancy);
  const [actionError, setActionError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);

  useEffect(() => {
    setActionError('');
    setIsConfirmingClose(false);
    dispatch(loadVacancy(id));
  }, [dispatch, id]);

  // Пока не загрузилась вакансия из адреса, старую не показываем
  if (status === 'loading' || status === 'idle' || loadedId !== id) return <Panel>Загрузка…</Panel>;
  if (status === 'error') return <Panel><ErrorMessage>{error}</ErrorMessage></Panel>;
  if (requireOwner && !vacancy.isOwner) {
    return <Panel><ErrorMessage>Это не ваша вакансия</ErrorMessage></Panel>;
  }

  const run = async (action, afterSuccess) => {
    setIsBusy(true);
    setActionError('');
    try {
      await dispatch(action);
      afterSuccess?.();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleRespond = () => run(setResponded(vacancy.id, true));
  const handleCancel = () => run(setResponded(vacancy.id, false), leaveTo && (() => history.push(leaveTo)));
  const handleClose = () => run(closeVacancy(vacancy.id), () => setIsConfirmingClose(false));

  return (
    <Panel>
      <Header>
        <Title>{vacancy.title}</Title>
        <ChipList>
          <Chip title="Уровень английского">English {vacancy.englishLevel}</Chip>
          <Chip title="Грейд">{vacancy.grade}</Chip>
        </ChipList>
      </Header>

      <Description>{vacancy.description}</Description>

      <Section>
        <SectionTitle>Контакты</SectionTitle>
        <Muted>Компания: {vacancy.company}</Muted>
      </Section>

      {vacancy.tags.length > 0 && (
        <Section>
          <ChipList>
            {vacancy.tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </ChipList>
        </Section>
      )}

      {actionError && <ErrorMessage>{actionError}</ErrorMessage>}

      <Footer>
        {user.role === 'applicant' && !vacancy.isActive && <Status>Вакансия закрыта</Status>}
        {user.role === 'applicant' && vacancy.responded && (
          <>
            <Status $tone="success">✓ Вы откликнулись</Status>
            <Button $variant="outline" onClick={handleCancel} disabled={isBusy}>
              Отменить отклик
            </Button>
          </>
        )}
        {user.role === 'applicant' && vacancy.isActive && !vacancy.responded && (
          <Button onClick={handleRespond} disabled={isBusy}>
            Откликнуться
          </Button>
        )}

        {vacancy.isOwner && <Status>Откликов: {vacancy.responsesCount}</Status>}
        {vacancy.isOwner && vacancy.isActive && !isConfirmingClose && (
          <Button $variant="danger" onClick={() => setIsConfirmingClose(true)}>
            Закрыть вакансию
          </Button>
        )}
        {/* Подтверждение прямо на странице: закрытая вакансия пропадёт из общего списка */}
        {vacancy.isOwner && vacancy.isActive && isConfirmingClose && (
          <>
            <Status>Закрыть вакансию? Она пропадёт из общего списка</Status>
            <Button $variant="outline" onClick={() => setIsConfirmingClose(false)} disabled={isBusy}>
              Отмена
            </Button>
            <Button $variant="danger" onClick={handleClose} disabled={isBusy}>
              Да, закрыть
            </Button>
          </>
        )}
        {vacancy.isOwner && !vacancy.isActive && <Status>Вакансия закрыта</Status>}
      </Footer>
    </Panel>
  );
}

export default VacancyDetails;

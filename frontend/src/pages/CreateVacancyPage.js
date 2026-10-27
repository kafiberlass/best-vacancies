import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Layout from '../components/Layout';
import TagSelect from '../components/TagSelect';
import { createVacancy, loadOptions } from '../store/actions/vacancies';
import { selectOptions } from '../store/selectors';
import { Button, ErrorMessage, Field, FieldLabel, Input, Muted, PageTitle, Panel, Select, Textarea } from '../components/ui';

const Form = styled(Panel).attrs({ as: 'form' })`
  max-width: 760px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;

  ${({ theme }) => theme.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const EMPTY_FORM = { title: '', description: '', englishLevel: '', grade: '', tags: [] };

// Страница "Создать вакансию" - доступна только работодателям
function CreateVacancyPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const options = useSelector(selectOptions);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(loadOptions()).catch((err) => setError(err.message));
  }, [dispatch]);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const handleChange = (event) => setField(event.target.name, event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      const vacancy = await dispatch(createVacancy(form));
      history.push(`/active-vacancies/${vacancy.id}`);
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <PageTitle>Создать вакансию</PageTitle>
      {!options && !error && <Muted>Загрузка…</Muted>}
      {options && (
        <Form onSubmit={handleSubmit} noValidate>
          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

          <Field>
            <FieldLabel>Название вакансии</FieldLabel>
            <Input name="title" value={form.title} onChange={handleChange} maxLength={120} required />
          </Field>

          <Field>
            <FieldLabel>Описание вакансии</FieldLabel>
            <Textarea name="description" value={form.description} onChange={handleChange} required />
          </Field>

          <Row>
            <Field>
              <FieldLabel>Уровень английского</FieldLabel>
              <Select name="englishLevel" value={form.englishLevel} onChange={handleChange} required>
                <option value="" disabled>
                  Выберите уровень
                </option>
                {options.englishLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <FieldLabel>Грейд</FieldLabel>
              <Select name="grade" value={form.grade} onChange={handleChange} required>
                <option value="" disabled>
                  Выберите грейд
                </option>
                {options.grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </Select>
            </Field>
          </Row>

          <Field as="div">
            <FieldLabel>Теги</FieldLabel>
            <TagSelect options={options.tags} value={form.tags} onChange={(tags) => setField('tags', tags)} />
          </Field>

          <Actions>
            <Button type="button" $variant="danger" onClick={() => history.push('/active-vacancies')}>
              Закрыть
            </Button>
            <Button type="submit" $variant="success" disabled={isSaving}>
              {isSaving ? 'Сохраняем…' : 'Сохранить'}
            </Button>
          </Actions>
        </Form>
      )}
      {!options && error && <ErrorMessage>{error}</ErrorMessage>}
    </Layout>
  );
}

export default CreateVacancyPage;

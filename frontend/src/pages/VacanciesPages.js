import VacanciesBoard from '../components/VacanciesBoard';

// /vacancies и /vacancies/:id - доступны обоим типам пользователей
export function VacanciesPage() {
  return <VacanciesBoard title="Вакансии" list="all" emptyText="Открытых вакансий пока нет" />;
}

// /my-vacancies и /my-vacancies/:id - только соискатель: вакансии, на которые он откликнулся
export function MyVacanciesPage() {
  return (
    <VacanciesBoard
      title="Мои вакансии"
      list="my"
      emptyText="Вы ещё не откликались на вакансии"
      detailsProps={{ leaveTo: '/my-vacancies' }}
    />
  );
}

// /active-vacancies и /active-vacancies/:id - только работодатель: его вакансии с числом откликов
export function ActiveVacanciesPage() {
  return (
    <VacanciesBoard
      title="Активные вакансии"
      list="my"
      emptyText="Вы ещё не создали ни одной вакансии"
      detailsProps={{ requireOwner: true }}
    />
  );
}

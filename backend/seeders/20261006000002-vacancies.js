'use strict';

const VACANCIES = [
  {
    employer: 'techcorp',
    title: 'Frontend-разработчик (React)',
    description:
      'Ищем разработчика в команду личного кабинета банка. Стек: React, Redux, TypeScript. Будешь разрабатывать новые разделы, покрывать код тестами и участвовать в код-ревью.',
    englishLevel: 'B1',
    grade: 'Middle',
    tags: ['React', 'Redux', 'TypeScript', 'Удалённо'],
  },
  {
    employer: 'techcorp',
    title: 'Junior JavaScript-разработчик',
    description:
      'Стажировка с последующим трудоустройством. Научим работать в команде, писать чистый код и пользоваться Git. Нужно знать основы JavaScript, HTML и CSS.',
    englishLevel: 'A2',
    grade: 'Junior',
    tags: ['JavaScript', 'HTML', 'CSS', 'Git', 'Офис'],
  },
  {
    employer: 'techcorp',
    title: 'Node.js backend-разработчик',
    description:
      'Разработка REST API для внутренних сервисов компании: Express, PostgreSQL, Docker. Важно умение проектировать базы данных и писать понятную документацию к API.',
    englishLevel: 'B2',
    grade: 'Senior',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'REST API'],
  },
  {
    employer: 'techcorp',
    title: 'Тимлид фронтенда',
    description:
      'Руководство командой из пяти фронтенд-разработчиков, планирование задач и развитие архитектуры приложения. Вакансия уже закрыта, кандидат найден.',
    englishLevel: 'C1',
    grade: 'Lead',
    tags: ['React', 'TypeScript', 'Полный день'],
    isActive: false,
  },
  {
    employer: 'webstudio',
    title: 'Верстальщик',
    description:
      'Адаптивная вёрстка лендингов и интернет-магазинов по макетам из Figma. Аккуратность, внимание к деталям и кроссбраузерность — обязательно.',
    englishLevel: 'A2',
    grade: 'Junior',
    tags: ['HTML', 'CSS', 'Частичная занятость', 'Удалённо'],
  },
  {
    employer: 'webstudio',
    title: 'Fullstack-разработчик',
    description:
      'Делаем сайты и веб-приложения для клиентов студии: фронтенд на React, бэкенд на Node.js и Express. Будешь вести проекты от идеи до запуска.',
    englishLevel: 'B1',
    grade: 'Middle',
    tags: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Полный день'],
  },
  {
    employer: 'webstudio',
    title: 'Стажёр-разработчик',
    description:
      'Оплачиваемая стажировка на три месяца. Подойдёт студентам и выпускникам курсов: будешь помогать команде с простыми задачами по фронтенду.',
    englishLevel: 'A1',
    grade: 'Intern',
    tags: ['JavaScript', 'HTML', 'CSS', 'Офис'],
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [users] = await queryInterface.sequelize.query(`SELECT id, login FROM "Users"`);
    const idByLogin = Object.fromEntries(users.map((u) => [u.login, u.id]));

    // Создаём по очереди с разницей во времени, чтобы порядок "сначала новые" был предсказуемым
    const start = Date.now() - VACANCIES.length * 60 * 60 * 1000;
    await queryInterface.bulkInsert(
      'Vacancies',
      VACANCIES.map(({ employer, isActive = true, ...vacancy }, index) => {
        const date = new Date(start + index * 60 * 60 * 1000);
        return { ...vacancy, isActive, employerId: idByLogin[employer], createdAt: date, updatedAt: date };
      })
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Vacancies', null, {});
  },
};

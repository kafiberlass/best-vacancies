'use strict';

// Кто на какую вакансию откликнулся: [логин соискателя, название вакансии]
const RESPONSES = [
  ['anna', 'Frontend-разработчик (React)'],
  ['anna', 'Fullstack-разработчик'],
  ['anna', 'Тимлид фронтенда'],
  ['ivan', 'Frontend-разработчик (React)'],
  ['ivan', 'Junior JavaScript-разработчик'],
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const [users] = await queryInterface.sequelize.query(`SELECT id, login FROM "Users"`);
    const [vacancies] = await queryInterface.sequelize.query(`SELECT id, title FROM "Vacancies"`);
    const userId = Object.fromEntries(users.map((u) => [u.login, u.id]));
    const vacancyId = Object.fromEntries(vacancies.map((v) => [v.title, v.id]));

    await queryInterface.bulkInsert(
      'Responses',
      RESPONSES.map(([login, title]) => ({
        userId: userId[login],
        vacancyId: vacancyId[title],
        createdAt: now,
        updatedAt: now,
      }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Responses', null, {});
  },
};

'use strict';

const { hashPassword } = require('../lib/password');

// Тестовые учётные записи (логин / пароль):
//   techcorp / company123 - работодатель «TechCorp»
//   webstudio / company123 - работодатель «Web Studio»
//   anna / applicant123 - соискатель
//   ivan / applicant123 - соискатель
const USERS = [
  { login: 'techcorp', password: 'company123', role: 'employer', companyName: 'TechCorp' },
  { login: 'webstudio', password: 'company123', role: 'employer', companyName: 'Web Studio' },
  { login: 'anna', password: 'applicant123', role: 'applicant', companyName: null },
  { login: 'ivan', password: 'applicant123', role: 'applicant', companyName: null },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = [];
    for (const user of USERS) {
      rows.push({ ...user, password: await hashPassword(user.password), createdAt: now, updatedAt: now });
    }
    await queryInterface.bulkInsert('Users', rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};

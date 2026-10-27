'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vacancies', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      title: { allowNull: false, type: Sequelize.STRING },
      description: { allowNull: false, type: Sequelize.TEXT },
      englishLevel: { allowNull: false, type: Sequelize.STRING },
      grade: { allowNull: false, type: Sequelize.STRING },
      tags: { allowNull: false, defaultValue: [], type: Sequelize.ARRAY(Sequelize.STRING) },
      isActive: { allowNull: false, defaultValue: true, type: Sequelize.BOOLEAN },
      employerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Vacancies');
  },
};

'use strict';

const { ENGLISH_LEVELS, GRADES, TAGS } = require('../lib/constants');

module.exports = (sequelize, DataTypes) => {
  const Vacancy = sequelize.define('Vacancy', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: 'Укажите название вакансии' }, notEmpty: { msg: 'Укажите название вакансии' }, len: { args: [0, 120], msg: 'Название — до 120 символов' } },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notNull: { msg: 'Добавьте описание вакансии' }, notEmpty: { msg: 'Добавьте описание вакансии' } },
    },
    englishLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: 'Выберите уровень английского' }, isIn: { args: [ENGLISH_LEVELS], msg: 'Выберите уровень английского' } },
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: 'Выберите грейд' }, isIn: { args: [GRADES], msg: 'Выберите грейд' } },
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      validate: {
        knownTags(value) {
          if (!Array.isArray(value) || value.some((tag) => !TAGS.includes(tag))) {
            throw new Error('Неизвестный тег');
          }
        },
      },
    },
    // Закрытая вакансия не видна в общем списке, но остаётся у работодателя
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  Vacancy.associate = (models) => {
    Vacancy.belongsTo(models.User, { as: 'employer', foreignKey: 'employerId' });
    Vacancy.belongsToMany(models.User, {
      through: models.Response,
      as: 'applicants',
      foreignKey: 'vacancyId',
      otherKey: 'userId',
    });
    Vacancy.hasMany(models.Response, { as: 'responses', foreignKey: 'vacancyId' });
  };

  return Vacancy;
};

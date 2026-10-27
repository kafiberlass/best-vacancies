'use strict';

const { ROLES } = require('../lib/constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Этот логин уже занят' },
        validate: {
          notNull: { msg: 'Укажите логин' },
          is: {
            args: /^[a-zA-Z0-9_.-]{3,32}$/,
            msg: 'Логин: от 3 до 32 символов — латинские буквы, цифры, «_», «.» или «-»',
          },
        },
      },
      // Хеш пароля (scrypt), сам пароль не хранится
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // applicant - соискатель, employer - работодатель
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isIn: { args: [ROLES], msg: 'Неизвестный тип пользователя' } },
      },
      // Название компании - только у работодателя
      companyName: {
        type: DataTypes.STRING,
      },
    },
    {
      defaultScope: { attributes: { exclude: ['password'] } },
      scopes: { withPassword: { attributes: { include: ['password'] } } },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Vacancy, { as: 'vacancies', foreignKey: 'employerId' });
    User.belongsToMany(models.Vacancy, {
      through: models.Response,
      as: 'respondedVacancies',
      foreignKey: 'userId',
      otherKey: 'vacancyId',
    });
  };

  return User;
};

'use strict';

// Отклик соискателя на вакансию. Пара (userId, vacancyId) уникальна - дважды откликнуться нельзя
module.exports = (sequelize, DataTypes) => {
  const Response = sequelize.define('Response', {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    vacancyId: { type: DataTypes.INTEGER, primaryKey: true },
  });

  return Response;
};

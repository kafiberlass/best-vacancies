// Данные для подключения к PostgreSQL можно переопределить переменными окружения:
// DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT
const base = {
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || null,
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 5432,
  dialect: "postgres",
  logging: false,
};

module.exports = {
  development: { ...base, database: process.env.DB_NAME || "best_vacancies_development" },
  test: { ...base, database: process.env.DB_NAME || "best_vacancies_test" },
  production: { ...base, database: process.env.DB_NAME || "best_vacancies_production" },
};

// API платформы вакансий BestVacancies.
// Подготовить БД: yarn dbr
// Запуск: node server.js (порт 3001, можно изменить переменной PORT)

const express = require("express");
const cors = require("cors");
const { sequelize, Sequelize } = require("./models");
const { HttpError } = require("./lib/httpError");
const authRouter = require("./routes/auth");
const vacanciesRouter = require("./routes/vacancies");

const PORT = Number(process.env.PORT) || 3001;

const app = express();

// React-приложение работает на другом порту, поэтому разрешаем ему запросы к API
app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(vacanciesRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.path} не найден` });
});

app.use((error, req, res, next) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message });
  }
  if (error instanceof Sequelize.ValidationError) {
    return res.status(400).json({ error: error.errors.map((e) => e.message).join("; ") });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Некорректный JSON в теле запроса" });
  }
  console.error(error);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT, () => console.log(`API запущен: http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error("Не удалось подключиться к базе данных:", error.message);
    process.exit(1);
  });

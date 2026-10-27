# BestVacancies

Сайт вакансий для двух ролей: работодатели публикуют вакансии, соискатели откликаются на них.
Fullstack-приложение: клиент на React, сервер на Express + PostgreSQL.

## Возможности

- Лента вакансий и подробная карточка вакансии
- Регистрация соискателя и отдельная регистрация компании
- **Работодатель:** создание вакансии (стек технологий выбирается тегами, уровень английского), список своих вакансий с откликами, закрытие вакансии
- **Соискатель:** отклик на вакансию, список активных откликов
- Авторизация по JWT и проверка ролей на сервере

## Стек

**Frontend:** React 18, Redux + Redux-Thunk, React Router, styled-components
**Backend:** Node.js, Express 5, Sequelize (миграции и сиды), PostgreSQL, JWT, хэширование паролей

## Структура

```
frontend/   React-клиент (pages, components, store)
backend/    REST API (routes, models, migrations, seeders)
```

## Запуск

Нужны Node.js, yarn и запущенный PostgreSQL.

```bash
# API: http://localhost:3001
cd backend
yarn install
yarn dbr        # создать базу, применить миграции и заполнить демо-данными
yarn start
```

```bash
# Клиент: http://localhost:3000
cd frontend
yarn install
yarn start
```

Подключение к базе настраивается переменными окружения `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`,
секрет токенов — `JWT_SECRET`.

**Демо-аккаунты:**

| Роль | Логин | Пароль |
|---|---|---|
| Работодатель | `techcorp`, `webstudio` | `company123` |
| Соискатель | `anna`, `ivan` | `applicant123` |

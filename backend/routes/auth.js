const express = require("express");
const { User, Sequelize } = require("../models");
const { HttpError } = require("../lib/httpError");
const { hashPassword, verifyPassword } = require("../lib/password");
const { createToken, toPublicUser, requireAuth } = require("../lib/auth");
const { ROLES } = require("../lib/constants");

const router = express.Router();
const MIN_PASSWORD_LENGTH = 6;

// POST /signup - регистрация соискателя ({ role: "applicant" }) или компании ({ role: "employer", companyName })
router.post("/signup", async (req, res) => {
  const { login, password, repeatPassword, role, companyName } = req.body ?? {};

  if (!ROLES.includes(role)) {
    throw new HttpError(400, "Неизвестный тип пользователя");
  }
  if (role === "employer" && !String(companyName ?? "").trim()) {
    throw new HttpError(400, "Укажите название компании");
  }
  if (String(password ?? "").length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`);
  }
  if (repeatPassword !== undefined && password !== repeatPassword) {
    throw new HttpError(400, "Пароли не совпадают");
  }

  const user = await User.create({
    login: String(login ?? "").trim(),
    password: await hashPassword(password),
    role,
    companyName: role === "employer" ? companyName.trim() : null,
  });

  res.status(201).json({ token: createToken(user), user: toPublicUser(user) });
});

// POST /login
router.post("/login", async (req, res) => {
  const { login, password } = req.body ?? {};
  const user = await User.scope("withPassword").findOne({ where: { login: String(login ?? "").trim() } });

  if (!user || !(await verifyPassword(String(password ?? ""), user.password))) {
    throw new HttpError(401, "Неверный логин или пароль");
  }
  res.json({ token: createToken(user), user: toPublicUser(user) });
});

// GET /me - текущий пользователь по токену (нужно, чтобы восстановить вход после перезагрузки)
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

module.exports = router;

// Авторизация по JWT: токен выдаётся при входе/регистрации, клиент хранит его
// и отправляет в заголовке Authorization: Bearer <token>
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { HttpError } = require("./httpError");

const JWT_SECRET = process.env.JWT_SECRET || "best-vacancies-dev-secret";
const TOKEN_TTL = "7d";

const createToken = (user) => jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: TOKEN_TTL });

// Данные пользователя, которые отдаём клиенту
const toPublicUser = (user) => ({
  id: user.id,
  login: user.login,
  role: user.role,
  companyName: user.companyName,
});

// Пропускает дальше только авторизованных, кладёт пользователя в req.user
async function requireAuth(req, res, next) {
  const [scheme, token] = (req.get("Authorization") || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(new HttpError(401, "Нужно войти в систему"));
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return next(new HttpError(401, "Сессия истекла, войдите снова"));
  }

  const user = await User.findByPk(payload.sub);
  if (!user) {
    return next(new HttpError(401, "Пользователь не найден"));
  }
  req.user = user;
  next();
}

const requireRole = (role, message) => (req, res, next) => {
  if (req.user.role === role) return next();
  next(new HttpError(403, message));
};

module.exports = { createToken, toPublicUser, requireAuth, requireRole };

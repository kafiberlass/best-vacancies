const express = require("express");
const { Vacancy, Response, sequelize } = require("../models");
const { HttpError } = require("../lib/httpError");
const { requireAuth, requireRole } = require("../lib/auth");
const { vacancyInclude, serializeVacancy, parseId, canView } = require("../lib/vacancies");
const { TAGS, ENGLISH_LEVELS, GRADES } = require("../lib/constants");

const router = express.Router();
router.use(requireAuth);

const newestFirst = [["createdAt", "DESC"], ["id", "DESC"]];

async function findVacancy(id, user) {
  const vacancy = await Vacancy.findByPk(parseId(id), { include: vacancyInclude });
  if (!vacancy || !canView(vacancy, user)) {
    throw new HttpError(404, "Вакансия не найдена");
  }
  return vacancy;
}

// GET /vacancies/options - справочники для формы создания вакансии
router.get("/vacancies/options", (req, res) => {
  res.json({ tags: TAGS, englishLevels: ENGLISH_LEVELS, grades: GRADES });
});

// GET /vacancies - все открытые вакансии
router.get("/vacancies", async (req, res) => {
  const vacancies = await Vacancy.findAll({ where: { isActive: true }, include: vacancyInclude, order: newestFirst });
  res.json(vacancies.map((vacancy) => serializeVacancy(vacancy, req.user)));
});

// GET /vacancies/:id
router.get("/vacancies/:id", async (req, res) => {
  res.json(serializeVacancy(await findVacancy(req.params.id, req.user), req.user));
});

// POST /vacancies - создать вакансию (только работодатель)
router.post("/vacancies", requireRole("employer", "Создавать вакансии могут только работодатели"), async (req, res) => {
  const { title, description, englishLevel, grade, tags } = req.body ?? {};
  const vacancy = await Vacancy.create({
    title: String(title ?? "").trim(),
    description: String(description ?? "").trim(),
    englishLevel,
    grade,
    tags: Array.isArray(tags) ? [...new Set(tags)] : [],
    employerId: req.user.id,
  });
  res.status(201).json(serializeVacancy(await findVacancy(vacancy.id, req.user), req.user));
});

// PUT /vacancies/:id - откликнуться ({ responded: true }) или отменить отклик ({ responded: false })
router.put("/vacancies/:id", requireRole("applicant", "Откликаться могут только соискатели"), async (req, res) => {
  const { responded } = req.body ?? {};
  if (typeof responded !== "boolean") {
    throw new HttpError(400, "Передайте responded: true или false");
  }

  const vacancy = await findVacancy(req.params.id, req.user);
  const key = { userId: req.user.id, vacancyId: vacancy.id };

  if (responded) {
    if (!vacancy.isActive) {
      throw new HttpError(409, "Вакансия закрыта, откликнуться нельзя");
    }
    // findOrCreate в транзакции: два одновременных клика не создадут два отклика
    const [, created] = await sequelize.transaction((transaction) =>
      Response.findOrCreate({ where: key, defaults: key, transaction })
    );
    if (!created) {
      throw new HttpError(409, "Вы уже откликнулись на эту вакансию");
    }
  } else {
    const removed = await Response.destroy({ where: key });
    if (!removed) {
      throw new HttpError(409, "Вы не откликались на эту вакансию");
    }
  }

  res.json(serializeVacancy(await vacancy.reload({ include: vacancyInclude }), req.user));
});

// DELETE /vacancies/:id - закрыть вакансию. Запись не удаляется, isActive становится false
router.delete("/vacancies/:id", requireRole("employer", "Закрывать вакансии могут только работодатели"), async (req, res) => {
  const vacancy = await findVacancy(req.params.id, req.user);
  if (vacancy.employerId !== req.user.id) {
    throw new HttpError(403, "Можно закрывать только свои вакансии");
  }
  if (vacancy.isActive) {
    await vacancy.update({ isActive: false });
  }
  res.json(serializeVacancy(vacancy, req.user));
});

// GET /my-vacancies - соискателю: вакансии, на которые он откликнулся;
// работодателю: все его вакансии (сначала открытые) с количеством откликов
router.get("/my-vacancies", async (req, res) => {
  let vacancies;
  if (req.user.role === "applicant") {
    const responses = await Response.findAll({ where: { userId: req.user.id }, attributes: ["vacancyId"] });
    vacancies = await Vacancy.findAll({
      where: { id: responses.map((r) => r.vacancyId) },
      include: vacancyInclude,
      order: newestFirst,
    });
  } else {
    vacancies = await Vacancy.findAll({
      where: { employerId: req.user.id },
      include: vacancyInclude,
      order: [["isActive", "DESC"], ...newestFirst],
    });
  }
  res.json(vacancies.map((vacancy) => serializeVacancy(vacancy, req.user)));
});

module.exports = router;

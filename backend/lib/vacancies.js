// Чтение вакансий и приведение их к виду для клиента
const { User, Response } = require("../models");
const { HttpError } = require("./httpError");

const SHORT_DESCRIPTION_LENGTH = 50;

const vacancyInclude = [
  { model: User, as: "employer", attributes: ["id", "companyName"] },
  { model: Response, as: "responses", attributes: ["userId"] },
];

const shorten = (text) =>
  text.length > SHORT_DESCRIPTION_LENGTH ? `${text.slice(0, SHORT_DESCRIPTION_LENGTH).trimEnd()}…` : text;

// Что видит конкретный пользователь: соискатель - отметку о своём отклике,
// работодатель - количество откликов только на СВОИ вакансии
function serializeVacancy(vacancy, user) {
  const isOwner = user.role === "employer" && vacancy.employerId === user.id;
  const responses = vacancy.responses || [];

  return {
    id: vacancy.id,
    title: vacancy.title,
    description: vacancy.description,
    shortDescription: shorten(vacancy.description),
    englishLevel: vacancy.englishLevel,
    grade: vacancy.grade,
    tags: vacancy.tags,
    isActive: vacancy.isActive,
    company: vacancy.employer?.companyName ?? "",
    employerId: vacancy.employerId,
    isOwner,
    responded: user.role === "applicant" ? responses.some((r) => r.userId === user.id) : undefined,
    responsesCount: isOwner ? responses.length : undefined,
    createdAt: vacancy.createdAt,
  };
}

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "Некорректный id вакансии");
  }
  return id;
}

// Закрытую вакансию видят только её автор и соискатели, которые на неё откликнулись
function canView(vacancy, user) {
  if (vacancy.isActive) return true;
  if (user.role === "employer") return vacancy.employerId === user.id;
  return (vacancy.responses || []).some((r) => r.userId === user.id);
}

module.exports = { vacancyInclude, serializeVacancy, parseId, canView };

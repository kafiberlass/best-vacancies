// Запросы к нашему backend. Адрес можно поменять переменной REACT_APP_API_URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'bestVacancies:token';

// Токен храним в localStorage - так пользователь остаётся в системе после перезагрузки
export const tokenStorage = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // без localStorage вход просто не переживёт перезагрузку
    }
  },
  remove() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ничего страшного
    }
  },
};

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  const token = tokenStorage.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { method, headers, body: body && JSON.stringify(body) });
  } catch {
    throw new ApiError(0, 'Сервер недоступен. Проверьте, что backend запущен');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'Что-то пошло не так');
  }
  return data;
}

export const api = {
  login: (credentials) => request('/login', { method: 'POST', body: credentials }),
  signup: (data) => request('/signup', { method: 'POST', body: data }),
  me: () => request('/me'),
  getVacancies: () => request('/vacancies'),
  getVacancy: (id) => request(`/vacancies/${id}`),
  getOptions: () => request('/vacancies/options'),
  createVacancy: (data) => request('/vacancies', { method: 'POST', body: data }),
  setResponded: (id, responded) => request(`/vacancies/${id}`, { method: 'PUT', body: { responded } }),
  closeVacancy: (id) => request(`/vacancies/${id}`, { method: 'DELETE' }),
  getMyVacancies: () => request('/my-vacancies'),
};

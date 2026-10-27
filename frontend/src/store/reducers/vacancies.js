import {
  AUTH_LOGOUT,
  VACANCIES_LOAD_START,
  VACANCIES_LOAD_SUCCESS,
  VACANCIES_LOAD_FAILURE,
  VACANCY_LOAD_START,
  VACANCY_LOAD_SUCCESS,
  VACANCY_LOAD_FAILURE,
  VACANCY_UPDATED,
  VACANCY_CREATED,
  OPTIONS_LOAD_SUCCESS,
} from '../actionTypes';

const emptyList = { items: [], status: 'idle', error: null };

const initialState = {
  all: emptyList,
  my: emptyList,
  // Открытая сейчас вакансия
  current: { item: null, id: null, status: 'idle', error: null },
  options: null,
};

const replaceIn = (items, vacancy) => items.map((item) => (item.id === vacancy.id ? vacancy : item));

export default function vacanciesReducer(state = initialState, action) {
  switch (action.type) {
    case VACANCIES_LOAD_START:
      return { ...state, [action.list]: { ...state[action.list], status: 'loading', error: null } };

    case VACANCIES_LOAD_SUCCESS:
      return { ...state, [action.list]: { items: action.payload, status: 'ready', error: null } };

    case VACANCIES_LOAD_FAILURE:
      return { ...state, [action.list]: { ...state[action.list], status: 'error', error: action.error } };

    case VACANCY_LOAD_START:
      return { ...state, current: { item: null, id: action.id, status: 'loading', error: null } };

    case VACANCY_LOAD_SUCCESS:
      return { ...state, current: { item: action.payload, id: String(action.payload.id), status: 'ready', error: null } };

    case VACANCY_LOAD_FAILURE:
      return { ...state, current: { item: null, id: action.id, status: 'error', error: action.error } };

    // Отклик/отмена/закрытие: обновляем вакансию везде, где она показана.
    // Закрытая вакансия пропадает из общего списка
    case VACANCY_UPDATED: {
      const vacancy = action.payload;
      const allItems = vacancy.isActive
        ? replaceIn(state.all.items, vacancy)
        : state.all.items.filter((item) => item.id !== vacancy.id);

      let myItems = replaceIn(state.my.items, vacancy);
      if (vacancy.responded === true && !myItems.some((item) => item.id === vacancy.id)) {
        myItems = [vacancy, ...myItems];
      }
      if (vacancy.responded === false) {
        myItems = myItems.filter((item) => item.id !== vacancy.id);
      }

      return {
        ...state,
        all: { ...state.all, items: allItems },
        my: { ...state.my, items: myItems },
        current: state.current.item?.id === vacancy.id ? { ...state.current, item: vacancy } : state.current,
      };
    }

    case VACANCY_CREATED:
      return {
        ...state,
        all: { ...state.all, items: [action.payload, ...state.all.items] },
        my: { ...state.my, items: [action.payload, ...state.my.items] },
      };

    case OPTIONS_LOAD_SUCCESS:
      return { ...state, options: action.payload };

    // При выходе забываем данные предыдущего пользователя
    case AUTH_LOGOUT:
      return { ...initialState, options: state.options };

    default:
      return state;
  }
}

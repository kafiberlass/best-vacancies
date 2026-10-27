import { api } from '../../api';
import {
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

const loaders = { all: api.getVacancies, my: api.getMyVacancies };

// list: 'all' - все открытые вакансии, 'my' - отклики соискателя или вакансии работодателя
export const loadVacancies = (list) => async (dispatch) => {
  dispatch({ type: VACANCIES_LOAD_START, list });
  try {
    dispatch({ type: VACANCIES_LOAD_SUCCESS, list, payload: await loaders[list]() });
  } catch (error) {
    dispatch({ type: VACANCIES_LOAD_FAILURE, list, error: error.message });
  }
};

export const loadVacancy = (id) => async (dispatch) => {
  dispatch({ type: VACANCY_LOAD_START, id });
  try {
    dispatch({ type: VACANCY_LOAD_SUCCESS, payload: await api.getVacancy(id) });
  } catch (error) {
    dispatch({ type: VACANCY_LOAD_FAILURE, id, error: error.message });
  }
};

// Отклик и отмена отклика (соискатель)
export const setResponded = (id, responded) => async (dispatch) => {
  dispatch({ type: VACANCY_UPDATED, payload: await api.setResponded(id, responded) });
};

// Закрытие вакансии (работодатель)
export const closeVacancy = (id) => async (dispatch) => {
  dispatch({ type: VACANCY_UPDATED, payload: await api.closeVacancy(id) });
};

export const createVacancy = (data) => async (dispatch) => {
  const vacancy = await api.createVacancy(data);
  dispatch({ type: VACANCY_CREATED, payload: vacancy });
  return vacancy;
};

export const loadOptions = () => async (dispatch, getState) => {
  if (getState().vacancies.options) return;
  dispatch({ type: OPTIONS_LOAD_SUCCESS, payload: await api.getOptions() });
};

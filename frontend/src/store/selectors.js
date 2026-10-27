export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectList = (list) => (state) => state.vacancies[list];
export const selectCurrentVacancy = (state) => state.vacancies.current;
export const selectOptions = (state) => state.vacancies.options;

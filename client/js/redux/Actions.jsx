export const SCHOOLS_UPDATED = 'SCHOOLS_UPDATED';

export function updateSchools(schools) {
  return { type: SCHOOLS_UPDATED, schools: schools };
}
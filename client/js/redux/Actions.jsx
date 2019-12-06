import {reduxStore} from '../application.js'

export const SCHOOLS_UPDATED = 'SCHOOLS_UPDATED';
export const ROLES_UPDATED = 'ROLES_UPDATED'

export function updateSchools(schools) {
  reduxStore.dispatch({type: "SCHOOLS_UPDATED", schools: schools })
}

export function updateRoles(roles) {
  reduxStore.dispatch({type: "ROLES_UPDATED", roles: roles })
}
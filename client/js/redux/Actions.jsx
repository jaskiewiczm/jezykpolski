import {reduxStore} from '../application.js'

export const SCHOOLS_UPDATED = 'SCHOOLS_UPDATED';
export const ROLES_UPDATED = 'ROLES_UPDATED'
export const MY_ROLES_UPDATED = 'MY_ROLES_UPDATED'
export const USER_UPDATED = 'USER_UPDATED'
export const SELECTED_SCHOOL_ID_UPDATED = 'SELECTED_SCHOOL_UPDATED'
export const SELECTED_KLASS_ID_UPDATED = 'SELECTED_KLASS_ID_UPDATED'

export function updateSchools(schools) {
  reduxStore.dispatch({type: "SCHOOLS_UPDATED", schools: schools })
}

export function updateRoles(roles) {
  reduxStore.dispatch({type: "ROLES_UPDATED", roles: roles })
}

export function updateMyRoles(roles) {
  reduxStore.dispatch({type: "MY_ROLES_UPDATED", myRoles: roles })
}

export function updateUser(user) {
  reduxStore.dispatch({type: "USER_UPDATED", user: user })
}

export function updateSelectedSchoolId(schoolId) {
  reduxStore.dispatch({type: SELECTED_SCHOOL_ID_UPDATED, selectedSchoolId: schoolId})
}

export function updateSelectedKlassId(klassId) {
  reduxStore.dispatch({type: SELECTED_KLASS_ID_UPDATED, selectedKlassId: klassId})
}
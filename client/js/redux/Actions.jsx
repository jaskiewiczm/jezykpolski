import {reduxStore} from '../application.js'

export const SCHOOLS_UPDATED = 'SCHOOLS_UPDATED';
export const ROLES_UPDATED = 'ROLES_UPDATED'
export const MY_ROLES_UPDATED = 'MY_ROLES_UPDATED'
export const USER_UPDATED = 'USER_UPDATED'

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
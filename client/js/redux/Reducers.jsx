import { SCHOOLS_UPDATED, ROLES_UPDATED, MY_ROLES_UPDATED, USER_UPDATED, SELECTED_SCHOOL_ID_UPDATED, SELECTED_KLASS_ID_UPDATED } from './Actions.jsx';

const initialState = {
  schools: [],
  roles: [],
  myRoles: [],
  user: null,
  selectedSchoolId: null,
  selectedKlassId: null
};

function schoolsReducer(state = initialState, action) {
  switch(action.type) {
    case SCHOOLS_UPDATED:
      return Object.assign({}, state, {
        schools: action.schools
      })
    case ROLES_UPDATED:
      return Object.assign({}, state, {
        roles: action.roles
      })
    case MY_ROLES_UPDATED:
      return Object.assign({}, state, {
        myRoles: action.myRoles
      })
    case USER_UPDATED:
      return Object.assign({}, state, {
        user: action.user
      })
    case SELECTED_SCHOOL_ID_UPDATED:
      return Object.assign({}, state, {
        user: action.selectedSchoolId
      })
    case SELECTED_KLASS_ID_UPDATED:
      return Object.assign({}, state, {
        user: action.selectedKlassId
      })
    default:
      return state;
  };
}

export default schoolsReducer;
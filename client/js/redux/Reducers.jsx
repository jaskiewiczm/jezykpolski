import { SCHOOLS_UPDATED, ROLES_UPDATED, MY_ROLES_UPDATED } from './Actions.jsx';

const initialState = {
  schools: [],
  roles: [],
  myRoles: []
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
    default:
      return state;
  };
}

export default schoolsReducer;
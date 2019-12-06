import { SCHOOLS_UPDATED, ROLES_UPDATED } from './Actions.jsx';

const initialState = {
  schools: [],
  roles: []
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
    default:
      return state;
  };
}

export default schoolsReducer;
import { SCHOOLS_UPDATED } from './Actions.jsx';

const initialState = {
  schools: []
};

function schoolsReducer(state = initialState, action) {
  switch(action.type) {
    case SCHOOLS_UPDATED:
      return {
        schools: [
          {
            schools: action.schools
          }
        ]
      };

    default:
      return state;
  };
}

export default schoolsReducer;
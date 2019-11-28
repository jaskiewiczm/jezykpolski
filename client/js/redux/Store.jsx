import { createStore } from 'redux';
import schoolsReducer from './Reducers.jsx';

const schoolStore = createStore(schoolsReducer);
export default schoolStore
import { combineReducers } from 'redux';
import alertReducer from './alert-reducer';
import authReducer from './authReducer';
import profileReducer from './profileReducer';

export default combineReducers({
  alertReducer,
  authReducer,
  profileReducer
})
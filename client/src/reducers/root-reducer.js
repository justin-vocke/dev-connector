import { combineReducers } from 'redux';
import alertReducer from './alert-reducer';
import authReducer from './authReducer';
import profileReducer from './profileReducer';
import postReducer from './postReducer';

export default combineReducers({
  alertReducer,
  authReducer,
  profileReducer,
  postReducer
})
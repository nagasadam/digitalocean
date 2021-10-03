import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { alert } from './alert.reducer';
import { questionbank } from './questionbank.reducer';
import { survey, activesurvey, inactivesurvey } from './survey.reducer';
import { dashboard } from './dashboard.reducer';
import { users } from './users.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  alert,
  questionbank,
  dashboard,
  survey,
  activesurvey,
  inactivesurvey,
  users
});

export default rootReducer;
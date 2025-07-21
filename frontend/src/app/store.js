import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import applicantProfileReducer from '../features/applicant-profile/applicantProfileSlice';
import skillReducer from '../features/skill/skillSlice'; 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    applicantProfile: applicantProfileReducer,
    skill: skillReducer
  },
});

export default store;
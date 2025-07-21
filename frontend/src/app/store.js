import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import applicantProfileReducer from '../features/applicant-profile/applicantProfileSlice';
import skillReducer from '../features/skill/skillSlice'; 
import jobTitleReducer from '../features/job-title/jobTitleSlice';
import workExperienceReducer from '../features/work-experience/workExperienceSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    applicantProfile: applicantProfileReducer,
    skill: skillReducer,
    jobTitle: jobTitleReducer,
    workExperience: workExperienceReducer,
  },
});

export default store;
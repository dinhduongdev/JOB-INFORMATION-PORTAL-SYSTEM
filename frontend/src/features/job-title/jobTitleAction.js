import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints, authApis } from "../../configs/apis";

export const fetchJobTitles = createAsyncThunk(
  'jobTitle/fetchJobTitles',
  async (token, { rejectWithValue }) => {
    try {
      const api = authApis(token);
      const response = await api.get(endpoints.jobTitle);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateJobTitle = createAsyncThunk(
  'jobTitle/updateJobTitle',
  async ({ token, jobTitleId }, { rejectWithValue }) => {
    try {
      const api = authApis(token);
      const response = await api.put(endpoints.myApplicantProfileUpdate, { job_title_id: jobTitleId }); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

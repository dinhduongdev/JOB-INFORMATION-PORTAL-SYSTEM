import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints, authApis } from "../../configs/apis";

export const fetchApplicantProfile = createAsyncThunk(
  'applicantProfile/fetchApplicantProfile',
  async (token, { rejectWithValue }) => {
    try {
      const api = authApis(token);
      const response = await api.get(endpoints.myApplicantProfile);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateApplicantProfile = createAsyncThunk(
  'applicantProfile/updateApplicantProfile',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const api = authApis(token);
      const response = await api.patch(endpoints.myApplicantProfileUpdate, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

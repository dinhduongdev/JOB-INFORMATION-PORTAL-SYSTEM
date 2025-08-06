import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints, authApis } from "../../configs/apis";
export const fetchSkills = createAsyncThunk(
  'skill/fetchSkills',
  async (token, { rejectWithValue }) => {
    try {
      const api = authApis(token);
      const response = await api.get(endpoints.skills);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSkills = createAsyncThunk(
  'skill/updateSkills',
  async ({ token, skillIds }, { rejectWithValue }) => {
    try {
      const api = authApis(token);
      const response = await api.put(endpoints.myApplicantProfileUpdate, { skill_ids: skillIds });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

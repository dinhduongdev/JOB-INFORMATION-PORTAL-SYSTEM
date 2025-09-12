import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints, authApis } from "../../configs/apis";


export const fetchWorkExperiences = createAsyncThunk(
  'workExperience/fetchWorkExperiences',
  async (token, { rejectWithValue }) => {
    try {
      const api = authApis(token);
      const response = await api.get(endpoints.workExperience); // Giả sử trả về danh sách work-experiences
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createWorkExperience = createAsyncThunk(
  'workExperience/createWorkExperience',
  async ({ token, workExperience }, { rejectWithValue }) => {
    try {
      const api = authApis(token);
      const response = await api.post(endpoints.workExperience, workExperience);
      return response.data; // Giả sử trả về object chứa id của work-experience mới
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateWorkExperience = createAsyncThunk(
  'workExperience/updateWorkExperience',
  async ({ token, workExperienceId, workExperience }, { rejectWithValue }) => {
    try {
      const api = authApis(token);
      const response = await api.put(`${endpoints.workExperience}${workExperienceId}/`, workExperience);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

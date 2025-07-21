import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints, authApis } from "../../configs/Apis";


const fetchAllPages = async (api, url, allSkills = []) => {
  const response = await api.get(url);
  const { results, next } = response.data;
  allSkills = [...allSkills, ...results];

  if (next) {
    return fetchAllPages(api, next, allSkills);
  }
  return allSkills;
};

export const fetchSkills = createAsyncThunk(
  'skill/fetchSkills',
  async (token, { rejectWithValue }) => {
    try {
      const api = authApis(token);
      const initialUrl = endpoints.skills;
      const allSkills = await fetchAllPages(api, initialUrl);
      return allSkills;
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
import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints, authApis } from '../../configs/apis';

export const fetchJobs = createAsyncThunk(
  'job/fetchJobs',
  async ({ token, search = '' }, { rejectWithValue }) => {
    try {
      const api = authApis(token);
      // Build the URL with the search query parameter if provided
      const url = search
        ? `${endpoints.jobSearch || '/api/v1/job-posts/'}?search=${encodeURIComponent(search)}`
        : endpoints.jobSearch || '/api/v1/job-posts/';
      const response = await api.get(url);
      return response.data.results; // Return the results array from the API
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
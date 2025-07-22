import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints, authApis } from '../../configs/apis';

export const fetchJobs = createAsyncThunk(
  'job/fetchJobs',
  async ({ token, search = '', salaryMin = null, salaryMax = null, currency = 'USD' }, { rejectWithValue }) => {
    try {
      const api = authApis(token);
      const params = new URLSearchParams();
      if (search) params.append('search', (search));
      if (salaryMin !== null && salaryMax !== null && !isNaN(salaryMin) && !isNaN(salaryMax) && parseInt(salaryMin) < parseInt(salaryMax)) {
        params.append('salary_currency', currency);
        params.append('salary_amount_gte', parseInt(salaryMin));
        params.append('salary_amount_lte', parseInt(salaryMax));
      }
      const url = `${endpoints.jobSearch || '/api/v1/job-posts/'}?${params.toString()}`;
      const response = await api.get(url);
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
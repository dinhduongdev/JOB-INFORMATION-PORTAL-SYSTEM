import { createSlice } from '@reduxjs/toolkit';
import { fetchJobs } from './jobActions';

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    jobs: { count: 0, results: [] },
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default jobSlice.reducer;
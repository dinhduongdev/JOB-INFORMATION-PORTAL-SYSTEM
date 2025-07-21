import { createSlice } from '@reduxjs/toolkit';
import { fetchJobTitles, updateJobTitle } from './jobTitleAction';

const jobTitleSlice = createSlice({
  name: 'jobTitle',
  initialState: {
    jobTitles: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobTitles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobTitles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobTitles = action.payload; // Giả sử trả về mảng các job titles
      })
      .addCase(fetchJobTitles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateJobTitle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateJobTitle.fulfilled, (state) => {
        state.status = 'succeeded';
        // Cập nhật nếu cần, tùy phản hồi API
      })
      .addCase(updateJobTitle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default jobTitleSlice.reducer;
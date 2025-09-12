import { createSlice } from '@reduxjs/toolkit';
import { fetchApplicantProfile, updateApplicantProfile } from './applicantProfileActions';

const applicantProfileSlice = createSlice({
  name: 'applicantProfile',
  initialState: {
    profile: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicantProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApplicantProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchApplicantProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateApplicantProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateApplicantProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload; // Cập nhật profile với dữ liệu mới
      })
      .addCase(updateApplicantProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default applicantProfileSlice.reducer;
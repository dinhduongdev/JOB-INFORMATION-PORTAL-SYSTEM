import { createSlice } from '@reduxjs/toolkit';
import { fetchStoredCv, deleteStoredCv, uploadCvFile } from './cvAction';

const cvSlice = createSlice({
  name: 'cv',
  initialState: {
    cv: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCvError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stored CV
      .addCase(fetchStoredCv.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStoredCv.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cv = action.payload;
      })
      .addCase(fetchStoredCv.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch CV';
      })
      // Delete Stored CV
      .addCase(deleteStoredCv.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteStoredCv.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cv = null; // Clear CV after deletion
      })
      .addCase(deleteStoredCv.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to delete CV';
      })
      // Upload CV File
      .addCase(uploadCvFile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadCvFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cv = action.payload; // Assuming the API returns the updated CV
      })
      .addCase(uploadCvFile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to upload CV file';
      });
  },
});

export const { clearCvError } = cvSlice.actions;
export default cvSlice.reducer;
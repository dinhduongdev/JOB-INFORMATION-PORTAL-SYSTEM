import { createSlice } from '@reduxjs/toolkit';
import { fetchWorkExperiences, createWorkExperience, updateWorkExperience } from './workExperienceAction';

const workExperienceSlice = createSlice({
  name: 'workExperience',
  initialState: {
    workExperiences: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkExperiences.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkExperiences.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workExperiences = action.payload; // Giả sử trả về mảng các work-experiences
      })
      .addCase(fetchWorkExperiences.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createWorkExperience.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createWorkExperience.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workExperiences.push(action.payload); // Thêm work-experience mới
      })
      .addCase(createWorkExperience.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateWorkExperience.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateWorkExperience.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.workExperiences.findIndex(w => w.id === action.payload.id);
        if (index !== -1) state.workExperiences[index] = action.payload;
      })
      .addCase(updateWorkExperience.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default workExperienceSlice.reducer;
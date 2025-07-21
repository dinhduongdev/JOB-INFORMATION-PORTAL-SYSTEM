import { createSlice } from '@reduxjs/toolkit';
import { fetchSkills, updateSkills } from './skillActions';

const skillSlice = createSlice({
  name: 'skill',
  initialState: {
    skills: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.skills = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateSkills.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSkills.fulfilled, (state) => {
        state.status = 'succeeded';
        // Cập nhật skills nếu cần, tùy thuộc vào phản hồi từ API
      })
      .addCase(updateSkills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default skillSlice.reducer;
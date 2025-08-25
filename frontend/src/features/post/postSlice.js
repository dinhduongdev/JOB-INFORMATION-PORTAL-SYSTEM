import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMyPostedJobsAPI, createJobAPI, updateJobAPI, deleteJobAPI } from "./postAPI";

// Giả sử token được lưu trong localStorage
const token = localStorage.getItem("token");

// --- THUNKS ---

// (ĐÃ CẬP NHẬT)
export const fetchMyPostedJobsThunk = createAsyncThunk(
  "post/fetchMyPostedJobs",
  async (page = 1) => { // Nhận page, mặc định là 1
    return await fetchMyPostedJobsAPI(token, page); // Truyền page xuống API
  }
);

export const createJobThunk = createAsyncThunk(
  "post/createJob",
  async (jobData) => {
    return await createJobAPI(token, jobData);
  }
);

export const updateJobThunk = createAsyncThunk(
  "post/updateJob",
  async ({ id, jobData }) => {
    return await updateJobAPI(token, id, jobData);
  }
);

export const deleteJobThunk = createAsyncThunk(
  "post/deleteJob",
  async (id) => {
    return await deleteJobAPI(token, id);
  }
);


// --- SLICE ---
const postSlice = createSlice({
  name: "post",
  initialState: {
    myJobs: { // Thay đổi thành object để chứa cả `results` và `count`
        count: 0,
        results: []
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchMyPostedJobsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyPostedJobsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = action.payload; // Payload giờ là { count, next, previous, results }
      })
      .addCase(fetchMyPostedJobsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // create
      .addCase(createJobThunk.fulfilled, (state, action) => {
        // Không cần push vào state nữa vì ta sẽ fetch lại trang hiện tại
        // state.myJobs.results.push(action.payload); 
      })

      // update
      .addCase(updateJobThunk.fulfilled, (state, action) => {
        const idx = state.myJobs.results.findIndex((job) => job.id === action.payload.id);
        if (idx !== -1) state.myJobs.results[idx] = action.payload;
      })

      // delete
      .addCase(deleteJobThunk.fulfilled, (state, action) => {
         // Không cần filter nữa vì ta sẽ fetch lại trang hiện tại
        // state.myJobs.results = state.myJobs.results.filter((job) => job.id !== action.payload);
      });
  },
});

export default postSlice.reducer;
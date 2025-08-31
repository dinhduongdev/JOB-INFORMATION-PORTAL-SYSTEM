
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createPostAPI, getMyPostsAPI, updatePostAPI } from "./postAPI";


// Lấy danh sách job đã đăng
export const fetchMyPosts = createAsyncThunk(
  "posts/fetchMyPosts",
  async (token, { rejectWithValue }) => {
    try {
      return await getMyPostsAPI(token);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Tạo job mới
export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      return await createPostAPI(data, token);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Cập nhật job
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, data, token }, { rejectWithValue }) => {
    try {
      return await updatePostAPI(id, data, token);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// // Xóa job
// export const deletePost = createAsyncThunk(
//   "posts/deletePost",
//   async ({ id, token }, { rejectWithValue }) => {
//     try {
//       return await deletePostAPI(id, token);
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

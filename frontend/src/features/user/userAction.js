import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMeAPI } from "./userAPI";


export const fetchMe = createAsyncThunk(
  "user/fetchMe",
  async (token, { rejectWithValue }) => {
    try {
      const data = await getMeAPI(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Không thể lấy thông tin user");
    }
  }
);

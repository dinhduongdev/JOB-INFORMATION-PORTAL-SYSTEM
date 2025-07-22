import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApis, endpoints } from '../../configs/apis'; // Adjust the import path as needed

export const fetchStoredCv = createAsyncThunk(
  'cv/fetchStoredCv',
  async (applicantId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const api = authApis(token);
      const response = await api.get(endpoints.storedCv(applicantId));
      console.log('Fetch response:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteStoredCv = createAsyncThunk(
  'cv/deleteStoredCv',
  async (applicantId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const api = authApis(token);
      await api.delete(endpoints.storedCv(applicantId));
      return applicantId; // Return applicantId to identify the deleted CV
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const uploadCvFile = createAsyncThunk(
  'cv/uploadCvFile',
  async ({ applicantId, file }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const api = authApis(token);
      const formData = new FormData();
      formData.append('file', file); // 'cv_file' should match the API's expected field name
      const response = await api.post(endpoints.storedCv(applicantId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const endpoints = {
    login: "o/token/",
    register: "/api/v1/auth/register/",
}

export const authApis = (token) => {
  return axios.create({
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axios.create({
  baseURL: apiUrl,
});
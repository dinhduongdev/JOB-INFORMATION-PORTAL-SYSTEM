
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const endpoints = {
    login: "o/token/",
    register: "/api/v1/auth/register/",
    myApplicantProfile : "/api/v1/applicant-profile/me/",
    myApplicantProfileUpdate: "/api/v1/applicant-profile/me/update/",
    skills: "/api/v1/skills/",
    jobTitle: "/api/v1/titles/",
    workExperience: "/api/v1/work-experience/",
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
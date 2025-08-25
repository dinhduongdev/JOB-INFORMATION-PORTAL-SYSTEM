
import axios from "axios";
import StoredCv from "../pages/StoredCv";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const endpoints = {
    login: "o/token/",
    me: "/api/v1/user/me/",
    register: "/api/v1/auth/register/",
    myApplicantProfile : "/api/v1/applicant-profile/me/",
    myApplicantProfileUpdate: "/api/v1/applicant-profile/me/update/",
    skills: "/api/v1/skills/",
    jobTitle: "/api/v1/titles/",
    myPostedJobs: "/api/v1/job-posts/my-posts/",
    workExperience: "/api/v1/work-experience/",
    "storedCv" : (applicant_id) => `/api/v1/${applicant_id}/cv/`,
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
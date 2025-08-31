import { authApis, endpoints } from "../../configs/apis";


// lấy danh sách job đã post
export const fetchMyPostedJobsAPI = async (token, page = 1) => {
  const res = await authApis(token).get(`${endpoints.myPostedJobs}?page=${page}`);
  return res.data;
};
// tạo job mới
export const createJobAPI = async (token, jobData) => {
  const res = await authApis(token).post("/api/v1/job-posts/", jobData);
  return res.data;
};

// update job
export const updateJobAPI = async (token, id, jobData) => {
  const res = await authApis(token).patch(`/api/v1/job-posts/${id}/`, jobData);
  return res.data;
};

// delete job
export const deleteJobAPI = async (token, id) => {
  await authApis(token).delete(`/api/v1/job-posts/${id}/`);
  return id;
};

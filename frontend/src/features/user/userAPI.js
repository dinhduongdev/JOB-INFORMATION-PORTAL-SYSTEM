import { authApis } from "../../configs/apis";
import { endpoints } from "../../configs/apis";

export const getMeAPI = async (token) => {
  try {
    const api = authApis(token);
    const response = await api.get(endpoints.me);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Không thể lấy thông tin user" };
  }
};

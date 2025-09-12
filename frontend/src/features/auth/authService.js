import Apis, { endpoints } from "../../configs/apis";
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

export const loginUserAPI = async (credentials) => {
  try {
    console.log("clientId: ", clientId);
    const response = await Apis.post(endpoints.login, {
      ...credentials,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "password",
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Đăng nhập thất bại" };
  }
};

export const registerUserAPI = async (formData) => {
  try {
    const response = await Apis.post(endpoints.register, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Đăng ký thất bại" };
  }
};

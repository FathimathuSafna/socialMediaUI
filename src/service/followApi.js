import { FOLLOW_INSTANCE } from "./axiosInstance";

export const getFollowers = async (token) => {
  try {
    const response = await FOLLOW_INSTANCE.get(`/`, {
      headers: {
        token: `${token}`,
      }});
    console.log("Followers data:", response);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
}

export const followUser = async (data) => {
  try {
    console.log("Data in followUser:", data);
    const response = await FOLLOW_INSTANCE.post(`/`, data)
    return response.data;
  }
    catch (error) {
    console.error("Error following user:", error);
    throw error;
    }
}
import { FOLLOW_INSTANCE } from "./axiosInstance";

export const getFollowers = async (token) => {
  try {
    const response = await FOLLOW_INSTANCE.get(`/`, {
      headers: {
        token: `${token}`,
      }});
    return response.data;
    
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
}

export const followUser = async (data) => {
  try {
    const response = await FOLLOW_INSTANCE.post(`/`, data)
    return response.data;
  }
    catch (error) {
    console.error("Error following user:", error);
    throw error;
    }
}
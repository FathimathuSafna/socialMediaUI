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
    console.log("Data to follow user:", data);
    console.log('token:',data.token)
    const response = await FOLLOW_INSTANCE.post(`/`, data, {
      headers: {
        token: `${data.token}`, 
      }
    }
    )
    return response.data;
  }
    catch (error) {
    console.error("Error following user:", error);
    throw error;
    }
}
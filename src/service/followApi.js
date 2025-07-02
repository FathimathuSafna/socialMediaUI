import { data } from "react-router-dom";
import { FOLLOW_INSTANCE } from "./axiosInstance";

export const getFollowers = async () => {
  try {
    const response = await FOLLOW_INSTANCE.get(`/`);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
}

export const followUser = async (data) => {
  try {
    console.log("Data to follow user:", data);
    const response = await FOLLOW_INSTANCE.post(`/`, data
    )
    return response.data;
  }
    catch (error) {
    console.error("Error following user:", error);
    throw error;
    }
}

export const getUserFollowers = async(data) => {
  try {
    const response = await FOLLOW_INSTANCE.get(`/`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user followers:", error);
    throw error;
  }
}
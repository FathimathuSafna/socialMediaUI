import { data } from "react-router-dom";
import { USER_INSTANCE } from "./axiosInstance";

export const signup = async (data) => {
  try {
    const response = await USER_INSTANCE.post("/", data);
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await USER_INSTANCE.post("/login", data);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
export const verify = async (data) => {
  try {
    const response = await USER_INSTANCE.post("/verify", data)
    return response.data;
  } catch (error) {
    console.error("Error during verification:", error);
    throw error;
  }
};

export const getAllUsers = async (data) => {
  try {
    console.log("Fetching all users...",data);
    const response = await USER_INSTANCE.get("/", data);
    return response.data;
  } catch (error) {
    console.error("Error during fetching users:", error);
    throw error;
  }
};

export const getUserDetails = async (userName) =>{
  try{
    const response = await USER_INSTANCE.get(`/${userName}`)
    return response.data
  } catch (error){
    console.log("error during fetching users:",error)
    throw error
  }
}

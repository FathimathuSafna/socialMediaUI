import {USER_INSTANCE} from "./axiosInstance";


export const signup = async (data) => {
    try {
        const response = await USER_INSTANCE.post("/", data);
        return response.data;
    } catch (error) {
        console.error("Error during signup:", error);
        throw error;
    }
    }


export const login = async (data) => {
    try {
        const response = await USER_INSTANCE.post("/login", data);
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}
export const verify = async (data) => {
    try {
        const response = await USER_INSTANCE.post("/verify", data);
        return response.data;
    } catch (error) {
        console.error("Error during verification:", error);
        throw error;
    }
}

export const getAllUsers = async (data) => {
    try {
        const response = await USER_INSTANCE.get("/", data);
        console.log("Users data:", response);
        return response.data;
    } catch (error) {
        console.error("Error during fetching users:", error);
        throw error;
    }
}
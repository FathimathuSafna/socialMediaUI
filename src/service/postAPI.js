import {POST_INSTANCE} from "./axiosInstance";

export const createPost = async (data) => {
    try {
        const response = await POST_INSTANCE.post("/", data);
        return response.data;
    } catch (error) {
        console.error("Error during creating post:", error);
        throw error;
    }
}

export const getPosts = async (data) => {
    try {
        const response = await POST_INSTANCE.get("/", data);
        return response.data;
    } catch (error) {
        console.error("Error during fetching posts:", error);
        throw error;
    }
}
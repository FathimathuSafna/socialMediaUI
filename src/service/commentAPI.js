import { COMMENT_INSTANCE } from "./axiosInstance";

export const createComment = async (data) => {
  try {
    const response = await COMMENT_INSTANCE.post("/", data);
    return response.data;
  } catch (error) {
    console.error("Error during creating comment:", error);
    throw error;
  }
}

export const getComments = async (postId,token) => {
  try {
    const response = await COMMENT_INSTANCE.get(`/${postId}`, 
      {
      headers: {
        token: `${token}`,
      }
    }
    );
    return response.data;
  } catch (error) {
    console.error("Error during fetching comments:", error);
    throw error;
  }
}
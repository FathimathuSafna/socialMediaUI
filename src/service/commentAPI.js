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

export const getComments = async (postId) => {
  try {
    const response = await COMMENT_INSTANCE.get(`/${postId}`, 
    );
    return response.data;
  } catch (error) {
    console.error("Error during fetching comments:", error);
    throw error;
  }
}

export const editComment = async (data) => {
  try {
    const response = await COMMENT_INSTANCE.put(`/${data.commentId}`, data, {
    });
    return response.data;
  } catch (error) {
    console.error("Error during editing comment:", error);
    throw error;
  }
}

export const deleteComment = async (commentId) => {
  try {
    const response = await COMMENT_INSTANCE.delete(`/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Error during deleting comment:", error);
    throw error;
  }
}


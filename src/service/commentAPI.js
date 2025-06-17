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

export const editComment = async (data, token) => {
  try {
    const response = await COMMENT_INSTANCE.put(`/${data.commentId}`, data, {
      headers: {
        token: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during editing comment:", error);
    throw error;
  }
}

export const deleteComment = async (commentId, token) => {
  try {
    const response = await COMMENT_INSTANCE.delete(`/${commentId}`, {
      headers: {
        token: `${token}`,
      },
    });
    console.log("Response from deleteComment:", response);
    return response.data;
  } catch (error) {
    console.error("Error during deleting comment:", error);
    throw error;
  }
}
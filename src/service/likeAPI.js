import { LIKE_INSTANCE } from "./axiosInstance";

export const likePost = async (data) => {
  try {
    const response = await LIKE_INSTANCE.post("/", data);
    if (response.status === false) {
      console.error("Like operation failed:", response);
      throw new Error("Like operation failed");
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("Error during liking post:", error);
    throw error;
  }
}



export const getLikesCount = async (data) => {
  try {
    console.log("Data for fetching likes count:................", data);
    const response = await LIKE_INSTANCE.get(`/${data.postId}`, {
      headers: {
        token: `${data.token}`,
      },
    });
    console.log("Likes count response:", response);
    return response.data;
  } catch (error) {
    console.error("Error during fetching likes:", error);
    throw error;
  }
};

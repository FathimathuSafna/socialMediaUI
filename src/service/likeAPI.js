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

export const likeUsers = async (postId) =>{
  try{
    const response = await LIKE_INSTANCE.get(`/${postId}`)
    console.log("response,",response.data)
    return response.data
  } catch(error){
    console.error("error during fetching users:",error)
    throw error
  }
}



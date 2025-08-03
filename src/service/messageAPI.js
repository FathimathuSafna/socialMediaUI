import { MESSAGE_INSTANCE } from "./axiosInstance";

export const createMessage = async (data) =>{
    try{
        const response = await MESSAGE_INSTANCE.post('/',data)
        return response.data
    } catch (error) {
        console.error("Error during creating message:",error)
        throw error
    }
}

export const getMessage = async (userName) =>{
    try{
        const response = await MESSAGE_INSTANCE.get(`/${userName}`)
        return response.data
    } catch(error){
        console.log("Error during fetching user messages:",error)
        throw error
    }
}

export const getMsgUser = async () => {
  try{
    const response = await MESSAGE_INSTANCE.get(`/`)
    return response.data
  } catch(error){
    console.error("Error by fetching users:",error)
    throw error
  }
}
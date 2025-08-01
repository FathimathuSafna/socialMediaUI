import { MESSAGE_INSTANCE } from "./axiosInstance";

export const createMessage = async (data) =>{
    try{
        const response = await MESSAGE_INSTANCE.post('/',data)
        console.log("response",response.data)
        return response.data
    } catch (error) {
        console.error("Error during creating message:",error)
        throw error
    }
}

export const getMessage = async (userName) =>{
    try{
        console.log("userName....",userName)
        const response = await MESSAGE_INSTANCE.get(`/${userName}`)
        console.log("response by fetching msg:",response)
        return response.data
    } catch(error){
        console.log("Error during fetching user messages:",error)
        throw error
    }
}
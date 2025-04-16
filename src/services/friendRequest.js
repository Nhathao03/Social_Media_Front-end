import axios from "axios";

const API_URL = "https://localhost:7174/api/friendsRequest";

export const addFriendRequest = async (senderID, receiverID) => {
    return axios.post(`${API_URL}/addFriendRequest`,{
        senderID : senderID.id,
        receiverID
    },{
        headers:{
            'Content-Type' : 'application/json',
        }
    })
} 

export const GetFriendRequestByReceiverID = async(ID) => {
    return axios.get(`${API_URL}/GetFriendRequestByReceiverID/${ID}`,{
        headers:{
            'Content-Type' :'application/json',
        }
    })
}

export const getFriendRequestByUserID = async(ID) => {
    return axios.get(`${API_URL}/getFriendRequestByUserID/${ID}`,{
        headers:{
            'Content-Type' :'application/json',
        }
    })
}

export const confirmRequest = async (id) => {
    return axios.put(`${API_URL}/confirmRequest/${id}`);
}

export const rejectFriendRequest = async (id) => {
    return axios.delete(`${API_URL}/rejectFriendRequest/${id}`);
}
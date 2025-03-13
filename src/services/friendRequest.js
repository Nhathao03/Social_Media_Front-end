import axios from "axios";

const API_URL = "https://localhost:7174/api/friendsRequest";

export const addFriendRequest = async (senderID, receiverID) => {
    return axios.post(`${API_URL}/addFriendRequest`,{
        senderID,
        receiverID
    },{
        headers:{
            'Content-Type' : 'application/json',
        }
    })
} 

export const getFriendRequestsBySenderID = async(senderID) => {
    return axios.get(`${API_URL}/getFriendRequestsBySenderID/${senderID}`,{
        headers:{
            'Content-Type' :'application/json',
        }
    })
}
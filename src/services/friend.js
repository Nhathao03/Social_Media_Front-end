import axios from "axios";

const API_URL = "https://localhost:7174/api/friend";

export const addFriend = async (id) => {
    return axios.post(`${API_URL}/addFriend/${id}`);
}

export const getAllFriend = async () => {
    return axios.get(`${API_URL}/getAllFriend`);
}

export const getAllFriendByUserID = async (userID) => {
    return axios.get(`${API_URL}/getAllFriendByUserID/${userID}`);
}



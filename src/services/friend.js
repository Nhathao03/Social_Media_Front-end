import axios from "axios";

const API_URL = "https://localhost:7174/api/friend";

export const addFriend = async (id) => {
    return axios.post(`${API_URL}/addFriend/${id}`);
}


export const getFriendOfEachUser = async (userID) => {
    return axios.get(`${API_URL}/getFriendOfEachUser/${userID}`);
}

export const getFriendRecentlyAdded = async (userID) => {
    return axios.get(`${API_URL}/getFriendRecentlyAdded/${userID}`);
}

export const GetFriendBaseOnHomeTown = async (userID) => {
    return axios.get(`${API_URL}/GetFriendBaseOnHomeTown/${userID}`);
}



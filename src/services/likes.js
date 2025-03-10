import axios from "axios";

const API_URL = "https://localhost:7174/api/like";

export const AddLike = async (userID, postID) => {
    return axios.post(`${API_URL}/AddLike`, {
        userID : userID.id,
        postID,
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
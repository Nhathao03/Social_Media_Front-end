import axios  from "axios";

const API_URL = "https://localhost:7174/api/postImage";

export const getAllPostImage = async () => {
    return axios.get(`${API_URL}/getAllPostImage`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const getPostImagesByUserID = async (userID) => {
    return axios.get(`${API_URL}/getPostImagesByUserID/${userID}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
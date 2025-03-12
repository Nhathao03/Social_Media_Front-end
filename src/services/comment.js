import axios from "axios";

const API_URL = "https://localhost:7174/api/comment";

export const createComment = async (userID, postID, Content, ImageUrl, sticker) => {
    return axios.post(`${API_URL}/CreateNewComment`, {
        userID : userID.id,
        postID,
        Content,
        ImageUrl : ImageUrl[0] == null ? "" : ImageUrl[0].Url,
        sticker : 0,
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const getCommentByID = async (id) => {
    return axios.get(`${API_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

import axios from "axios";

const API_URL = "https://localhost:7174/api/post";

export const createpost = async (userID, Content, Views, Share, PostImages, PostCategoryID) => {
    return axios.post(`${API_URL}/CreatePost`, { 
        userID : userID.id, 
        Content, 
        Views : 0, 
        Share : 0, 
        PostImages,
        PostCategoryID : 1,
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};


export const getAllPost = async () => {
    return axios.get(`${API_URL}/GetAllPost`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

};

export const deletePostById = async (postId) => {
    return axios.delete(`${API_URL}/${postId}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};
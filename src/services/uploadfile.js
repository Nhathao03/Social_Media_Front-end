import axios from "axios";

const API_URL = "https://localhost:7174/api/uploadfile";

export const uploadfile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${API_URL}/uploadfile`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}

export const UploadFileComment = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${API_URL}/UploadFileComment`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
}
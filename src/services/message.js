import axios from "axios";

const API_URL = "https://localhost:7174/api/message";

export const getAllMessages = async () => {
    return axios.get(`${API_URL}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

export const getMessageById = async (id) => {
    return axios.get(`${API_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

export const sendMessage = async (messageDTO) => {
    return axios.post(`${API_URL}/sendMessage`, messageDTO, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

export const getMessagesByUsers = async (receiverID, senderID) => {
    return axios.get(`${API_URL}/getMessages/${receiverID}/${senderID}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

export const updateMessage = async (id, message) => {
    return axios.put(`${API_URL}/${id}`, message, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

export const deleteMessage = async (id) => {
    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

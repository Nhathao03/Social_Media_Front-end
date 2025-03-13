import axios from "axios";

const API_URL = "https://localhost:7174/api/address";

export const getAllAddress = () => {
    return axios.get(`${API_URL}/getAllAddress`,{
        headers:
            {
                'Content-Type' : 'application/json',
            }
    })
}
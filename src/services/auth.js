import axios from "axios";

const API_URL = "https://localhost:7174/api/auth";

export const login = async (email, password) => {
    return axios.post(`${API_URL}/login`, {
        email,
        password
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

export const register = async (fullName, email, password, birth, phonenumber) => {
    return axios.post(`${API_URL}/register`, {
        fullName,
        email,
        password,
        birth,
        phonenumber
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
};

export const getCurrentUser = () => {
    return localStorage.getItem("token");
}

export const getUserById = async (userID) => {
    return axios.get(`${API_URL}/GetUserById`, {
        params: { userID }
    });
};

export const findUser = async (stringData) => {
    return axios.get(`${API_URL}/findUser/${stringData}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const UpdatePersonalInformation = async (userID, fullname, addressID, birth, gender, avatar) => {
    return axios.put(`${API_URL}/UpdatePersonalInformation`, {
        userID,
        fullname,
        addressID,
        birth,
        gender,
        avatar
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    );
}

export const google_login = async () => {
    return axios.get(`${API_URL}/google-login`);
}

export const decodeToken = async (token) => {
    return axios.post(`${API_URL}/decode`, JSON.stringify(token), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
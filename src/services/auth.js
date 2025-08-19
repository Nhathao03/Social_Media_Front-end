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
    return axios.get(`${API_URL}/GetUserById/${userID}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

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

export const ChangPassword = async (userID, currentPass, newPass, verifyPass) => {
    return axios.put(`${API_URL}/ChangePassword`, {
        userID,
        currentPass, 
        newPass,
        verifyPass
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    );
}

export const manageContact = async (userID, phoneNumber) => {
    return axios.put(`${API_URL}/ManageContact`, {
        userID,
        phoneNumber
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const UpdateBackgroundUser = async (userID, backgroundImage) => {
    return axios.put(`${API_URL}/UpdateBackgroundUser`, {
        userID,
        backgroundImage
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
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

export const forgotpassword = async (email) => {
    return axios.post(`${API_URL}/forgot-password`, {
        email
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const resetPassword = async (email, newPassword, Otp) => {
    return axios.post(`${API_URL}/reset-password`, {
        email,
        newPassword,
        Otp
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
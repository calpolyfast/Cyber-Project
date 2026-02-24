const API_BASE_URL = import.meta.env.API_BASE_URL;
import axios from "axios";

export const getProfile = () => {
    return axios.get(`${API_BASE_URL}/profile`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const updateAccount = (account) => {
    return axios.post(`${API_BASE_URL}/deleteAccount`, account);
}




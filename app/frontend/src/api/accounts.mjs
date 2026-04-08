const API_BASE_URL = import.meta.env.API_BASE_URL;
import axios from "axios";

export const getProfile = () => {
    return axios.get(`${API_BASE_URL}/profile`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const deleteAccount = (account) => {
    return axios.post(`${API_BASE_URL}/deleteAccount`, account);
}

export const updateProfile = (account) => {
    return axios.get(`${API_BASE_URL}/updateAccount`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}




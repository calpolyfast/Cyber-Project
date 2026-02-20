const API_BASE_URL = import.meta.env.API_BASE_URL;
import axios from "axios";

export const getAllAccounts = () => {
    // Note: NOT DONE YET.
    return axios.get(`${API_BASE_URL}/profile`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
};
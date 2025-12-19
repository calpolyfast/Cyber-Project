const API_BASE_URL = import.meta.env.VITE_API_URL;
import axios from "axios";

export const getProducts = () => {
    // Fetch from the backend with search query
    return axios.get(`${API_BASE_URL}/products`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
};

export const searchProduct = (searchQuery) => {
    // Fetch from the backend with search query
    return axios.get(`${API_BASE_URL}/search`, {
        params: {
            query: searchQuery
        },
        headers: {
            'Content-Type': 'application/json'
        }
    })
};

export const addProduct = (formData) => {
    // Fetch from the backend with search query
    return axios.post(`${API_BASE_URL}/products`, formData, 
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )
};
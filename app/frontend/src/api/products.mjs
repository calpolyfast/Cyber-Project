import api from "./axios.mjs";

const API_BASE_URL = import.meta.env.VITE_API_URL;
import axios from "axios";

export const getProducts = () => {
    // Fetch from the backend with search query
    return api.get(`/products`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
};

export const getProductById = (productId) => {
    return api.get(`/products/${productId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const searchProduct = (searchQuery) => {
    // Fetch from the backend with search query
    return api.get(`/products/search`, {
        params: {
            name: searchQuery
        },
        headers: {
            'Content-Type': 'application/json'
        }
    })
};

export const addProduct = (formData) => {
    // Fetch from the backend with search query
    return api.post(`/products`, formData, 
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )
};
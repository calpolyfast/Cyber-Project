import { API_BASE_URL } from "../config.mjs";

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
import api from "./axios.mjs";

export const getOrders = (userId) => {
    // Fetch from the backend with search query
    return api.get(`/orders`,
        {
            userId: userId
        }
    )
};
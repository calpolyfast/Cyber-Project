import api from "./axios.mjs";

export const placeOrder = (order) => {
    return api.post('/orders', {
            ...order
        }
    )
}

export const getOrders = (userId) => {
        return api.get(`/orders`
    )
};
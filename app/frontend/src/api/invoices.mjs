import api from "./axios.mjs";

export const getInvoiceByOrderID = (orderId) => {
    // Fetch from the backend with search query
    return api.get(`/orders`,
        {
            orderId: orderId
        }
    )
};
import api from "./axios.mjs";

export const getInvoiceByOrderID = (orderId) => {
        return api.get(`/invoices/${orderId}`
    )
};
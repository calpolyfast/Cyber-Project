import api from "./axios.mjs";

export const createChamber = async () => {
    const res = await api.post('/new-chamber')
    return res
}

export const deleteChamber = async () => {
    const res = await api.delete(`/delete-chamber/`)
    return res
}
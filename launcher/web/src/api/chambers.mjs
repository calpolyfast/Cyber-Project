import api from "./axios.mjs";

export const createChamber = async () => {
    const res = await api.post('/new-chamber')
    return res
}

export const deleteChamber = async (id) => {
    const res = await api.delete(`/delete-chamber/${id}`)
    return res
}
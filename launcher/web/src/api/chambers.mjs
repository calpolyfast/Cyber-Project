import api from "./axios.mjs";

export const createChamber = async () => {
    const res = await api.post('/new-chamber')
    return res
}
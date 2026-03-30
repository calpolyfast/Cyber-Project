import api from "./axios.mjs"

export const createNewChamber = () => {
    return api.get('/chamber/new')
}
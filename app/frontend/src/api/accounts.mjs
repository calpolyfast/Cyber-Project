import api from "./axios.mjs"

export const getProfile = () => {
    return api.get('/accounts/me')
}

export const deleteAccount = () => {
    return api.delete('/accounts/')
}

export const updateProfile = (account) => {
    return api.put('/accounts/', account);
}




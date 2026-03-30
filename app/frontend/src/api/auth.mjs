import api from "./axios.mjs";

export const getStoredUser = () => {
    return JSON.parse(localStorage.getItem("userdata"))
}

export const storeUser = (id, token) => {
    localStorage.setItem("userdata", JSON.stringify({ id, token }))
}

export const removeStoredUser = () => {
    localStorage.removeItem("userdata")
}

export const postLogin = (username, password) => {
    // Fetch from the backend with search query
    return api.post(`/users/login`,
        {
            username: username, 
            password: password
        }
    )
};

export const postRegister = (username, email, password) => {
    // Fetch from the backend with search query
    return api.post(`/users/register`, 
        {
            username: username,
            email: email, 
            password: password
        }
    )
};
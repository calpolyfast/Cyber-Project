import api from "./axios.mjs";

export const getStoredToken = () => {
    return localStorage.getItem("token")
}

export const storeToken = (token) => {
    localStorage.setItem("token", token)
}

export const postLogin = (username, password) => {
    // Fetch from the backend with search query
    return api.post(`${API_BASE_URL}/users/login`,
        {
            username: username, 
            password: password
        }
    )
};

export const postRegister = (username, email, password) => {
    // Fetch from the backend with search query
    return api.post(`${API_BASE_URL}/users/register`, 
        {
            username: username,
            email: email, 
            password: password
        }
    )
};
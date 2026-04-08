import axios from 'axios';
import { getStoredUser, removeStoredUser, storeUser } from './auth.mjs';
axios.defaults.withCredentials = true

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(config => {
    const user = getStoredUser()
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    console.log(user)
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status == 401) {
            removeStoredUser()
        }
        return Promise.reject(error)
    }
)

api.interceptors.request

export default api;
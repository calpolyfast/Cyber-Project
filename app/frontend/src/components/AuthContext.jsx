import { useState } from "react";
import { createContext } from "react";
import { postLogin, postRegister, storeToken } from "../api/auth.mjs";

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState({})

    const login = async (username, password) => {
        try {
            const res = await postLogin(username, password)
            setToken(res.data)
            storeToken(res.data)

        } catch (error) {
            console.error("Login failed: ", error);
        }
    }

    const logout = () => {
        setUser({})
    }

    const register = (username, email, password) => {
        postRegister(username, email, password)

    }

    return <AuthContext.Provider value={{ login, logout, register }}>
        {children}
    </AuthContext.Provider>
}
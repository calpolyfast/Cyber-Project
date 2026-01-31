import { useEffect, useState } from "react";
import { createContext } from "react";
import { getStoredToken, postLogin, postRegister, storeToken } from "../api/auth.mjs";

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [ token, setToken ] = useState()
    const [ loaded, setLoaded ] = useState(false)

    const login = async (username, password) => {
        try {
            const res = await postLogin(username, password)
            setToken(res.data.token)
            storeToken(res.data.token)

        } catch (error) {
            console.error("Login failed: ", error);
        }
    }

    const logout = () => {
        setToken()
    }

    const register = async (username, email, password) => {
        try {
            const res = await postRegister(username, email, password);
            await login(username, password)

        } catch (error) {
            console.error("Register failed: ", error);
        }
    }

    useEffect(() => {
        const token = getStoredToken()
        
        if (token != null)
        {
            setToken(token)
        }
        setLoaded(true)
    }, [])

    return <AuthContext.Provider value={{ login, logout, register, token, loaded }}>
        {children}
    </AuthContext.Provider>
}
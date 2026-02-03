import { useEffect, useState } from "react";
import { createContext } from "react";
import { getStoredToken, postLogin, postRegister, storeToken } from "../api/auth.mjs";

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [ token, setToken ] = useState()
    const [ isAuthenticated, setIsAuthenticated ] = useState(false)
    const [ loaded, setLoaded ] = useState(false)

    const login = async (username, password) => {
        try {
            const res = await postLogin(username, password)

            if (res.data?.token)
            {
                setIsAuthenticated(true)
            }

            setToken(res.data?.token)
            
            // Store token in localStorage - Token exfiltration via XSS vulnerability
            storeToken(res.data?.token)
            return res.data?.token

        } catch (error) {
            console.error("Login failed: ", error);
        }
    }

    const logout = () => {
        setIsAuthenticated(false)
        setToken()
    }

    const register = async (username, email, password) => {
        try {
            const res = await postRegister(username, email, password);
            const token = await login(username, password)
            return token

        } catch (error) {
            console.error("Register failed: ", error);
        }
    }

    // Effect that checks if the user is authenticated 
    useEffect(() => {
        const token = getStoredToken()
        
        if (token != null)
        {
            setToken(token)
        }
        setLoaded(true)
    }, [])

    return <AuthContext.Provider value={{ login, logout, register, token, loaded, isAuthenticated }}>
        {children}
    </AuthContext.Provider>
}
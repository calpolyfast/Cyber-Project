import { useEffect, useState } from "react";
import { createContext } from "react";
import { getStoredUser, removeStoredUser, postLogin, postRegister, storeUser } from "../api/auth.mjs";

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState({})
    const [ isAuthenticated, setIsAuthenticated ] = useState(false)
    const [ loaded, setLoaded ] = useState(false)

    const login = async (username, password) => {
        try {
            const res = await postLogin(username, password)

            if (res.data?.token)
            {
                setIsAuthenticated(true)
            }

            const newUser = { id: res.data?.id, token: res.data?.token }

            setUser(newUser)
            
            // Store token in localStorage - Token exfiltration via XSS vulnerability
            storeUser(res.data?.id, res.data?.token)

            // Also, alert the flag if SQL injection was successfully performed
            if (res.data?.flag){
                alert(res.data.flag)
            }

            return newUser

        } catch (error) {
            alert("Login failed. Please check your credentials and try again.")
            console.error("Login failed: ", error);
        }
    }

    const logout = () => {
        setIsAuthenticated(false)
        setUser({})
        removeStoredUser()
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
        const storedUser = getStoredUser()
        
        if (storedUser?.token != null)
        {
            setUser(storedUser)
            setIsAuthenticated(true)
        }
        setLoaded(true)
    }, [])

    return <AuthContext.Provider value={{ login, logout, register, user, loaded, isAuthenticated }}>
        {children}
    </AuthContext.Provider>
}
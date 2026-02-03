import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext, useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loaded } = useContext(AuthContext);

    if (!loaded)
    {
        return null
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }
    
    return children
}

export default ProtectedRoute
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext, useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
    const { token, loaded } = useContext(AuthContext);

    if (!loaded)
    {
        return null
    }

    if (!token) {
        return <Navigate to="/login" replace />
    }
    
    return children
}

export default ProtectedRoute
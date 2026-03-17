import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, user, loaded } = useContext(AuthContext);

    if (!loaded)
    {
        return null
    }
    
    if (!isAuthenticated || (roles && !roles.includes(jwtDecode(user.token).role))) {
        return <Navigate to="/login" />
    }
    
    return children
}

export default ProtectedRoute
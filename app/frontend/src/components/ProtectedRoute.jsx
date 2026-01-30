import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext);

    console.log(token)

    if (token == null) {
        return <Navigate to="/login" replace />
    }
    
    return children
}

export default ProtectedRoute
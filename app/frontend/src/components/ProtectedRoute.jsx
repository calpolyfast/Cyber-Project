import { Navigate } from "react-router-dom";
import { AuthContext, useAuth } from "./AuthContext";
import Loading from "../../pages/Loading";
import { useContext } from "react";

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext);

    if (token == null) {
        return <Navigate to="/login" replace />
    }
    return children
}

export default ProtectedRoute
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }: { children: ReactNode }) {
    const { token, role } = useAuth();

    if(!token) {
        return <Navigate to="/login" replace />;
        }

    if(role !== "ADMIN"){
        return <Navigate to="/products" replace />;
        }

    return children;

}
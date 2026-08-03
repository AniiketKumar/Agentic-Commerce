import  { createContext, useContext, useState, type ReactNode } from "react";
import { decodeToken } from "../utils/jwt";

interface AuthContextType {
    token: string | null;
    role: string | null;
    login: (token: string) => void;
    logout: () => void;
    }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [role, setRole] = useState<string | null>(() => {
        const existing = localStorage.getItem("token");
        return existing ? decodeToken(existing)?.role ?? null: null;
        });

    function login(newToken: string) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setRole(decodeToken(newToken)?.role ?? null);
        }
    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setRole(null);
        }

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
        );
    }

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider");
        }
    return context;
    }
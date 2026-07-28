import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/authApi";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login: setAuthToken } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        try{
            const token = await login(username, password);
            setAuthToken(token);
            navigate("/products");
            }catch(err){
                setError((err as Error).message);
            }
        }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
               <div>
                  <label>Username</label>
                  <input value={username} onChange={(e) => setUsername(e.target.value)} />
               </div>
               <div>
                   <label>Password</label>
                   <input type="password" value = {password} onChange={(e) => setPassword(e.target.value)} />
               </div>

               {error && <p style ={{ color: "red" }}>{error}</p>}
               <button type="submit">Login</button>
            </form>
        </div>
        );

    }
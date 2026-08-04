// stub — full content to be typed in
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register } from "../api/authApi";
import { login } from "../api/authApi";

export default function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login: setAuthToken } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent){
        e.preventDefault();
        setError(null);

        if(password !== confirmPassword) {
            setError("Passwords do not match");
            return;
            }
        try {
            await register(username, email, password);
            const token = await login(username, password);
            setAuthToken(token);
            navigate("/products");
            } catch (err) {
                setError((err as Error).message);
            }
        }

// //old design
//     return (
//         <div>
//             <h1>Register</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Username</label>
//                     <input value={username} onChange={(e) => setUsername(e.target.value)} />
//                 </div>
//                 <div>
//                    <label>Email</label>
//                    <input type = "email" value ={email} onChange={(e) => setEmail(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>Password</label>
//                     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//                 </div>
//                 <div>
//                     <label>Confirm Password</label>
//                     <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
//                 </div>
//
//                 {error && <p style={{ color: "red" }}>{error}</p>}
//                 <button type="submit">Register</button>
//             </form>
//             <p>Already have an account? <Link to="/login">Login</Link></p>
//         </div>
//         );

        return (
            <div>
                <h1>Register</h1>
                <form onSubmit={handleSubmit} className="form">
                    <h2>{editingid === null ? "Add Product" : `Editing product #${editingId}`}</h2>
                    <div className="form-group">
                        <label>Name</label>
                        <input value={name} onChange={(e) => setname(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Stock Quantity</label>
                        <input type="number" value={stockQuantity} onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input value={imageUrl} onChange={(e) => setImageurl(e.target.value)} />
                    </div>

                    <div className="form-actions">
                        <button type="submit">{editingId === null ? "Create" : "Save"}</button>
                        {editingId !== null && <button type="button" onClick={resetForm}>Cancel</button>}
                    </div>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
            );

}
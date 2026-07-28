import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <nav>
            <Link to="/products">products</Link>
            {" | "}
            <Link to="/cart">Cart</Link>
            {token ? <button onClick={handleLogout}>Logout</button> : <Link to="/login">Login</Link>}
        </nav>
    );
}
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
    const { token, role, logout } = useAuth();
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
            { token && (
                <>
                {" | "}
                <Link to="/orders">My Orders</Link>
                </>
                )}
            {role === "ADMIN" && (
                            <>
                            {" | "}
                            <Link to="/admin">Admin</Link>
                            {" | "}
                            <Link to="/admin/orders">All Orders</Link>
                            </>
                            )}
            {" | "}
            {token ? <button onClick={handleLogout}>Logout</button> : <Link to="/login">Login</Link>}
        </nav>
    );
}
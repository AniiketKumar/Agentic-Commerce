import { useEffect, useState } from "react";
import type { Order } from "../types/Order";
import { fetchAllOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        if(!token) return;
        fetchAllOrders(token)
            .then(setOrders)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        }, [token]);
    if(loading) return <p>Loading...</p>;
    if(error) return <p className="error-text">{error}</p>

    return (
        <div>
            <h1>All Orders</h1>
            {orders.map((order) => (
                <div key={order.id} className="card">
                <p>Order #{order.id} - <span classname={`status-badge status-${order.status.toLowerCase()}`}>{order.status.toLowerCase()}</span> -by {order.user.username}</p>
                <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
                <ul>
                    {order.items.map((item) => (
                        <li key={item.id}>
                            {item.product.name} x {item.quantity} - ${item.priceAtPurchase}
                        </li>
                        ))}
                </ul>
                <p>Total: ${order.totalAmount}</p>
                </div>
                ))}
        </div>
        );

}
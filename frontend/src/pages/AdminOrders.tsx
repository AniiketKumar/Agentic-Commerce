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
    if(error) return <p style={{ color: "red" }}>{error}</p>

    return (
        <div>
            <h1>All Orders</h1>
            {orders.map((order) => (
                <div key={order.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                <p>Order #{order.id} - {order.status} -by {order.user.username}</p>
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
import { useEffect, useState } from "react";
import type { Order } from "../types/Order";
import { fetchMyOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        if(!token) return;
        fetchMyOrders(token)
            .then(setOrders)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        }, [token]);

    if(loading) return <p>Loading...</p>;
    if(error) return <p className="error-text">{error}</p>;
    if(orders.length === 0) return <p>You haven't placed any orders yet. </p>;

    return (
        <div>
            <h1>My Orders</h1>
            {orders.map((order) => (
                <div key={order.id} className="card">
                    <p>Order #{order.id} - <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status.toLowerCase()}</span></p>
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
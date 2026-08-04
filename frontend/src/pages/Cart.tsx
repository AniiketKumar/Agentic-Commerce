import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/orderApi";

export default function Cart() {
    const { items, removeFromCart, clearCart, total } = useCart();
    const { token } = useAuth();
    const [placing, setPlacing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handlePlaceOrder() {
        if(!token) return;
        setPlacing(true);
        setError(null);
        try {
            const payload = items.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
            }));
            await placeOrder(payload, token);
            clearCart();
            setSuccess(true);
        }  catch (err) {
            setError((err as Error).message);
        } finally {
            setPlacing(false);
        }
    }

    if(success){
        return <p>Order placed successfully!</p>;
    }

    if(items.length === 0) {
        return <p>Your Cart is empty.</p>
    }

    return (
        <div>
            <h1>Cart</h1>
            <ul className="cart-list">
             {items.map((item) => (
                 <li key={item.product.id} className="card card-item">
                     <div>
                         <p className="card-item-name">{item.product.name}</p>
                         <p className="card-item-meta">qty {item.quantity} : ${(item.product.price * item.quantity).toFixed(2)}</p>
                     </div>
                    <button onClick={() => removeFromCart(item.product.id)}>Remove</button>
                 </li>
                 ))}
             </ul>
             <p className="cart-total">Total: ${total.toFixed(2)}</p>
             {error && <p className="error-text">{error}</p>}
             <button onClick={handlePlaceOrder} disabled={placing}>
                 {placing ? "placing order..." : "Place Order"}
             </button>
        </div>
    );

}
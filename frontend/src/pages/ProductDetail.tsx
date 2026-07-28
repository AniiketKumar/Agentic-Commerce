import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../types/Product";
import { fetchProductById } from "../api/productApi";

//cart
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        if(!id) return;
        fetchProductById(id)
            .then(setProduct)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        }, [id]);

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>
    if(!product) return <p>Product not found.</p>

    return (
        <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>In stock: {product.stockQuantity}</p>
            <input
                type="number"
                min={1}
                max={product.stockQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button onClick={() => addToCart(product, quantity)}>Add to Cart</button>
        </div>
        );
    }
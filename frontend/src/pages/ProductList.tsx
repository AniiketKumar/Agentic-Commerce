import {useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types/Product";
import { fetchProducts } from "../api/productApi";

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        }, []);

    if(loading) return <p>Loading products...</p>;
    if(error) return <p>Error: {error}</p>

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.map((product)=>(
                    <li key={product.id}>
                        <Link to={`/products/${product.id}`}>
                            {product.name} - ${product.price}
                        </Link>
                    </li>
                    ))}
            </ul>
        </div>
        );
}
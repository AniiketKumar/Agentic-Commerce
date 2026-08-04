import {useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types/Product";
import { fetchProducts } from "../api/productApi";

import "./ProductList.css";

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

// //old design
//     return (
//         <div>
//             <h1>Products</h1>
//             <ul>
//                 {products.map((product)=>(
//                     <li key={product.id}>
//                         {product.imageUrl && (<img src={product.imageUrl} alt={product.name} width={80}/>)}
//                         <Link to={`/products/${product.id}`}>
//                             {product.name} - ${product.price}
//                         </Link>
//                     </li>
//                     ))}
//             </ul>
//         </div>
//         );
        return (
            <div>
                <h1>Products</h1>
                <div className="product-grid">
                    {products.map((product) => (
                        <Link to={`/products/${product.id}`} key={product.id} className="card product-card">
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="product-thumb" />}
                        <p className = "product-name">{product.name}</p>
                        <p className = "product-price">{product.price}</p>
                        </Link>
                        ))}
                </div>
            </div>
            );
}
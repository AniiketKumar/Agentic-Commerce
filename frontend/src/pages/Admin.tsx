import { useEffect, useState, type FormEvent } from "react";
import type { Product } from "../types/Product";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api/productApi";
import { useAuth } from "../context/AuthContext";

export default function Admin() {
    const[products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        fetchProducts()
        .then(setProducts)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
        }, []);

    function resetForm() {
        setEditingId(null);
        setName("");
        setDescription("");
        setPrice("");
        setStockQuantity("");
        setImageUrl("");
        }

    function startEdit(product: Product){
        setEditingId(product.id);
        setName(product.name);
        setDescription(product.description);
        setPrice(String(product.price));
        setStockQuantity(String(product.stockQuantity));
        setImageUrl(product.imageUrl ?? "");
        }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if(!token) return;
        setError(null);

        const payload = {
            name,
            description,
            price: Number(price),
            stockQuantity: Number(stockQuantity),
            imageUrl,
            };

        try {

            if(editingId === null){
                const created = await createProduct(payload, token);
                setProducts((prev) => [...prev, created]);
                } else {
                    const updated = await updateProduct(editingId, payload, token);
                    setProducts((prev) => prev.map((p) => (p.id === editingId ? updated: p)));
                    }
            resetForm();
            } catch (err){
                setError((err as Error).message);
            }
    }

async function handleDelete(id: number) {
    if(!token) return;
    if(!window.confirm("Delete this product?")) return;

    try {
        await deleteProduct(id, token);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError((err as Error).message);
        }
    }

if(loading) return <p>Loading...</p>;

return (
    <div>
        <h1>Admin - Products</h1>
        {error && <p style={{ color: "red"}}> {error}</p>}

        <form onSubmit={handleSubmit}>
            <h2>{editingId === null ? "Add Product" : `Editing Product #${editingId}`}</h2>
            <div>
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>Description</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <label>Price</label>
                <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
                <label>Stock Quantity</label>
                <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />
            </div>
            <div>
                <label>Image URL</label>
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>

            <button type="submit">{editingId === null ? "Create" : "Save"}</button>
            {editingId !== null && <button type="button" onClick={resetForm}>Cancel</button>}
        </form>

        <hr />

        <ul>
            {products.map((product) => (
                <li key={product.id}>
                    {product.name} - ${product.price} - stock: {product.stockQuantity}
                    {" "}
                    <button onClick={() => startEdit(product)}>Edit</button>
                    {" "}
                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                </li>
                ))}
        </ul>
    </div>
    );
}
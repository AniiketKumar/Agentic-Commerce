import type { Product } from "../types/Product";

// const BASE_URL = "http://localhost:8080";
const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/products`);
    if(!response.ok){
        throw new Error("Failed to fetch products");
        }
    return response.json();
    }

export async function fetchProductById(id: string): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if(!response.ok){
        throw new Error("Failed to fetch product");
        }
    return response.json();
    }

export async function createProduct(product: Omit<Product, "id">, token: string): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            },
        body: JSON.stringify(product),
        });

    if(!response.ok){
        throw new Error("Failed to create product");
        }
    return response.json();
    }

export async function updateProduct(id: number, product: Omit<Product, "id">, token: string): Promise<Product>{
    const response = await fetch(`${BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            },
        body: JSON.stringify(product),
        });

    if(!response.ok){
        throw new Error("Failed to update product");
        }

    return response.json();
    }

export async function deleteProduct(id: number, token: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
        });
    if(!response.ok){
        throw new Error("Failed to delete product");
        }
    }
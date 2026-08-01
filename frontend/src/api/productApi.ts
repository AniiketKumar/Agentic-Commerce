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
// const BASE_URL = "http://localhost:8080";
const BASE_URL = import.meta.env.VITE_API_URL;

import type { Order } from "../types/Order";

interface OrderItemPayload {
    productId: number;
    quantity: number;
}

export async function placeOrder(items: OrderItemPayload[], token: string) {
    const response = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            },
        body: JSON.stringify({items}),
        });
    if(!response.ok) {
        throw new Error("Failed to place order");
    }
return response.json();

}

export async function fetchMyOrders(token: string): Promise<Order[]> {
    const response = await fetch(`${BASE_URL}/orders/my`, {
        headers: { "Authorization": `Bearer ${token}` },
        })
    if(!response.ok) {
        throw new Error("Failed to fetch orders");
        }

    return response.json();

}

export async function fetchAllOrders(token: string): Promise<Order[]> {
    const response = await fetch(`${BASE_URL}/orders`, {
        headers: { "Authorization": `Bearer ${token}`},
        });
    if(!response.ok){
        throw new Error("Failed to fetch all orders");
        }
    return response.json();

}

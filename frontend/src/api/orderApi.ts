const BASE_URL = "http://localhost:8080";

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
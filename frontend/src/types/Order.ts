export interface OrderItem {
    id: number;
    product: {
        id: number;
        name: string;
        imageUrl?: string;
        };
    quantity: number;
    priceAtPurchase: number;
    }

export interface Order {
    id: number;
    user: {
        id: number;
        username: string;
        email: string;
        };
    items: OrderItem[];
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    totalAmount: number;
    createdAt: string;
    }
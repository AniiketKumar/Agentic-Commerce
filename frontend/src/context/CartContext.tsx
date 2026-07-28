import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "../types/Product";

interface CartItem {
    product: Product;
    quantity: number;
    }

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    total: number;
    }

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({children}: { children: ReactNode}) {
    const [items, setItems] = useState<CartItem[]>([]);

    function addToCart(product: Product, quantity: number) {
        setItems((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if(existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                }
            return [...prev, { product, quantity }];
            });
        }

    function removeFromCart(productId: number) {
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
        }

    function clearCart() {
        setItems([]);
    }

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
        );
}

export function useCart() {
    const context = useContext(CartContext);
    if(!context){
        throw new Error("useCart must be used within cartProvider");
        }
    return context;
}

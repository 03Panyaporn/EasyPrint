"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
    id: string;
    fileName: string;
    fileUrl?: string;          // blob URL for preview in checkout
    file?: File;                // actual File object for uploading at checkout
    documentType: string;
    documentDetail: string;
    documentSize: string;
    quantity: number;
    extraOption: string;
    pageCount: number;
    totalPrice: number;
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    selectedIds: Set<string>;
    selectedItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    removeSelectedItems: () => void;
    toggleSelect: (id: string) => void;
    selectAll: () => void;
    clearSelection: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const addToCart = (item: CartItem) => {
        setCartItems((prev) => [...prev, item]);
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    };

    const clearCart = () => { setCartItems([]); setSelectedIds(new Set()); };

    const removeSelectedItems = () => {
        setCartItems(prev => prev.filter(item => !selectedIds.has(item.id)));
        setSelectedIds(new Set());
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id); else n.add(id);
            return n;
        });
    };

    const selectAll = () => setSelectedIds(new Set(cartItems.map((i) => i.id)));
    const clearSelection = () => setSelectedIds(new Set());

    const selectedItems = cartItems.filter((i) => selectedIds.has(i.id));

    return (
        <CartContext.Provider value={{
            cartItems, cartCount: cartItems.length,
            selectedIds, selectedItems,
            addToCart, removeFromCart, clearCart, removeSelectedItems,
            toggleSelect, selectAll, clearSelection,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}

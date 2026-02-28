import { createContext, useEffect, useState, useMemo } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const MAX_QUANTITY = 50;

    const [cart, setCart] = useState(() => {
        const stored = sessionStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    });
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        sessionStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item, quantity) => {
        setCart(prevCart => {
            const existingIndex = prevCart.findIndex(
                c => c.item.id === item.id
            );

            if (existingIndex !== -1) {
                const updated = [...prevCart];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: Math.min(
                        updated[existingIndex].quantity + quantity,
                        MAX_QUANTITY
                    )
                };
                return updated;
            }

            return [...prevCart, { item, quantity }];
        });
        setShowCart(true)
    };

    const removeFromCart = (id) => {
        setCart(prevCart =>
            prevCart.filter(c => c.item.id !== id)
        );
        setShowCart(true)
    };

    const updateCartItemQuantity = (id, quantity) => {
        setCart(prevCart =>
            prevCart.map(c =>
                c.item.id === id
                    ? { ...c, quantity: Math.min(quantity, MAX_QUANTITY) }
                    : c
            )
        );
        setShowCart(true)
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartItem = (id) => {
        return cart.find(c => c.item.id === id);
    };

    const totalItems = useMemo(() => {
        return cart.reduce((sum, c) => sum + c.quantity, 0);
    }, [cart]);

    const totalPrice = useMemo(() => {
        return cart.reduce((sum, c) => {
            return sum + c.item.price * c.quantity;
        }, 0);
    }, [cart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                showCart,
                totalItems,
                totalPrice,
                MAX_QUANTITY,
                addToCart,
                removeFromCart,
                updateCartItemQuantity,
                clearCart,
                getCartItem,
                setShowCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

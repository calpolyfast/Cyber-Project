import { useEffect, useState } from "react";
import { createContext } from "react";

export const CartContext = createContext([])

export const CartProvider = ({ children }) => {
    const MAX_QUANTITY = 50

    const getCart = () => {
        return JSON.parse(sessionStorage.getItem("cart"))
    }

    const addToCart = (item, quantity) => {
        const sessionCart = getCart()

        const toAdd = {
            item: item,
            quantity: quantity, 
        }

        if (sessionCart.some(cartObject => cartObject.item.id == item.id))
        {
            sessionCart[sessionCart.findIndex(cartObject => cartObject.item.id == item.id)].quantity++
        }
        else
        {
            sessionCart.push(toAdd)
        }
        
        sessionStorage.setItem("cart", JSON.stringify(sessionCart))
    }

    const removeFromCart = (id) => {
        const sessionCart = getCart()

        sessionStorage.setItem("cart", JSON.stringify(sessionCart.filter(cartObject => cartObject.item.id != id)))
    }

    const updateCartItemQuantity = (id, quantity) => {
        const sessionCart = getCart()

        sessionCart[sessionCart.findIndex(cartObject => cartObject.item.id == id)].quantity = quantity
        
        sessionStorage.setItem("cart", JSON.stringify(sessionCart))
    }

    useEffect(() => {
        if (!sessionStorage.getItem("cart"))
        {
            sessionStorage.setItem("cart", JSON.stringify([]))
        }
    }, [])

    return <CartContext.Provider value={{ getCart, addToCart, removeFromCart, updateCartItemQuantity, MAX_QUANTITY }}>
        {children}
    </CartContext.Provider>
}
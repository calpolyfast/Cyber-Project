import { useEffect, useState } from "react"
import ContentWrapper from "../components/ContentWrapper"
import { getOrders } from "../api/orders.mjs"

const CartEmpty = () => {
    return <div>Your shopping cart is empty!</div>
}

const Cart = () => {
    const [ items, setItems ] = useState([])

    useEffect(() => {
        // getOrders here
    }, [])

    return <ContentWrapper>
        <h1 className="text-4xl text-center border-b font-bold">Shopping Cart</h1>
        <ol>
            {items.length == 0 ? <CartEmpty /> : "AA"}
        </ol>
    </ContentWrapper>
}

export default Cart
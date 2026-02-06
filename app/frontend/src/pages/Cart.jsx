import { useEffect, useState } from "react"
import ContentWrapper from "../components/ContentWrapper"
import { getOrders } from "../api/orders.mjs"

const CartEmpty = () => {
    return <div>Your shopping cart is empty!</div>
}

const OrderList = ({ items }) => {
    return <div className="flex flex-3 flex-col p-2 bg-primary text-white">
        <h2 className="text-4xl text-center">Your Items</h2>
        <ol>
            {items.map((item, index) => {
                return <li className="flex flex-row gap-1">
                    <img src={item.image} className="flex-2"></img>
                    <div className="flex-2 text-xl text-center align-bottom">
                        <h1 className="text-2xl">{item.name}</h1>
                        <p>{"$" + item.price}</p>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-row items-center justify-between gap-2 p-2">
                            <button className="text-4xl">{"<"}</button>
                            <div className="text-xl">{"Quantity: " + item.quantity}</div>
                            <button className="text-4xl">{">"}</button>
                        </div>
                    </div>
                </li>
            })}
        </ol>
    </div>
}

const OrderSummary = ({ items }) => {
    const total = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)

    return <div className="flex flex-1 flex-col p-2 justify-between h-[80lvh] bg-primary text-white">
        <div>
            <h2 className="text-2xl text-center">Order Summary</h2>
            <ol>
                {items.map((item, index) => {
                    return <li>{item.quantity + " " + item.name + " - $" + item.price * item.quantity}</li>
                })}
            </ol>
        </div>
        <div>
            <div className="text-center text-2xl p-2">
                {"Total: $" + total}
            </div>
            <button className="bg-primary-light p-2 text-3xl w-full">Place Order</button>
        </div>
    </div>
}

const Cart = () => {
    const [ items, setItems ] = useState([
        {
            name: "Apple", 
            quantity: 3,
            price: 10.99, 
            image: null
        }, 
        {
            name: "Apple2", 
            quantity: 2,
            price: 9.1, 
            image: null
        }, 
        {
            name: "Apple3", 
            quantity: 1,
            price: 1, 
            image: null
        }
    ])

    useEffect(() => {
        // getOrders here
    }, [])

    return <ContentWrapper>
        <h1 className="text-4xl text-center border-b font-bold">Shopping Cart</h1>
        <div className="flex flex-row gap-2">
            <OrderList items={items}></OrderList>
            <OrderSummary items={items}></OrderSummary>
        </div>
    </ContentWrapper>
}

export default Cart
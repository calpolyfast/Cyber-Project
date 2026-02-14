import { useContext, useEffect, useRef, useState } from "react"
import ContentWrapper from "../components/ContentWrapper"
import { getOrders } from "../api/orders.mjs"
import { CartContext } from "../components/CartContext"
import { AuthContext } from "../components/AuthContext"

const CartEmpty = () => {
    return <div>Your shopping cart is empty!</div>
}

const OrderEntry = ({ order }) => {
    const datePlaced = new Date(order.createdAt)

    return <li className="flex flex-row gap-1">
            <div className="flex-1" >{order.id}</div>
            <div className="flex-1" >{"$" + order.totalPrice}</div>
            <div className="flex-1" >{datePlaced.toDateString()}</div>
        </li>
}

const OrderList = ({ orders }) => {
    return <div className="flex flex-3 flex-col p-2 bg-primary text-white">
        <div className="flex flex-row gap-1">
            <div className="flex-1" >{"Order ID"}</div>
            <div className="flex-1" >{"Total"}</div>
            <div className="flex-1" >{"Date Placed"}</div>
        </div>
        <ol className="flex flex-col gap-2">
            {orders.map((order, index) => {
                return <OrderEntry key={index} order={order}></OrderEntry>
            })}
        </ol>
    </div>
}

const Orders = () => {
    const [ orders, setOrders ] = useState([])
    const { user } = useContext(AuthContext)

    useEffect(() => {
        getOrders(user.id)
            .then((res) => {
                console.log(res.data?.orders)
                setOrders(res.data?.orders)
            })
    }, [])

    return <div className="page-wrapper">
        <ContentWrapper>
            <h1 className="text-4xl text-center border-b font-bold">Your Orders</h1>
            <div className="flex flex-row gap-2">
                <OrderList orders={orders}/>
            </div>
        </ContentWrapper>
    </div>
}

export default Orders
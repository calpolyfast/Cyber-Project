import { useContext, useEffect, useRef, useState } from "react"
import ContentWrapper from "../components/ContentWrapper"
import LoadingSpinner from "../components/LoadingSpinner"
import { getOrders } from "../api/orders.mjs"
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { AuthContext } from "../components/AuthContext"
import { useNavigate } from "react-router-dom";

const CartEmpty = () => {
    return <div className="text-center">You haven't ordered anything yet!</div>
}

const OrderEntry = ({ order }) => {
    const navigate = useNavigate()
    const datePlaced = new Date(order.createdAt)

    return <li className="flex flex-row gap-1">
        <div className="flex-2" >{order.id}</div>
        <div className="flex-2" >{"$" + order.totalPrice}</div>
        <div className="flex-2" >{datePlaced.toDateString()}</div>
        <div className="flex-1 flex justify-end flex-row gap-x-1 items-center hover:text-primary hover:underline cusor-pointer" 
                        onClick={() => navigate(`/invoice/?id=${order.id}`)}>
            <LiaFileInvoiceDollarSolid className="text-xl md:hidden"/>
            <div className="hidden md:flex">View Invoice</div>
        </div>
        
    </li>
}

const OrderList = ({ orders }) => {
    return <div className="flex flex-3 flex-col p-2 bg-bg text-dark">
        <div className="flex flex-row gap-1 border-b">
            <div className="flex-2" >{"Order ID"}</div>
            <div className="flex-2" >{"Total"}</div>
            <div className="flex-2" >{"Date Placed"}</div>
            <div className="flex-1"></div>
        </div>
        <ol className="flex flex-col gap-2">
            {orders?.length > 0 ? orders.map((order, index) => {
                return <OrderEntry key={index} order={order}></OrderEntry>
            }) : <CartEmpty />}
        </ol>
    </div>
}

const Orders = () => {
    const [ orders, setOrders ] = useState([])
    const { user } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getOrders(user.id)
            .then((res) => {
                console.log(res.data?.orders)
                setOrders(res.data?.orders)
            })
            .finally(() => { setLoading(false) })
    }, [])

    return <ContentWrapper>
            <h1 className="text-4xl bg-transparent text-dark text-center font-bold">Your Orders</h1>
            <div className="flex flex-row h-full w-full gap-2">
                { loading && <div className="flex h-full w-full justify-center items-center">
                    <LoadingSpinner />
                </div> }
                { !loading && <OrderList orders={orders}/> }
            </div>
        </ContentWrapper>
}

export default Orders
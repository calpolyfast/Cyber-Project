import { useSearchParams } from "react-router-dom"
import ContentWrapper from "../components/ContentWrapper";
import { useState } from "react";
import { useEffect } from "react";
import { getInvoiceByOrderID } from "../api/invoices.mjs";

const RenderOnLoaded = ({ loaded, placeholder, children }) => {
    if (!loaded)
    {
        return placeholder
    }
    return children
}

const PlaceholderTableElement = () => {
    return <tr>
        <td className="animate-pulse">Loading...</td>
    </tr>
}

const Invoice = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loaded, setLoaded] = useState(false)
    const [orderInfo, setOrderInfo] = useState([])

    useEffect(() => {
        getInvoiceByOrderID(searchParams.get("id"))
            .then((res) => {
                setOrderInfo(res.data)
                setLoaded(true)
            })
    }, [])

    return <ContentWrapper>
        <div className="flex flex-col items-center align-middle gap-4 p-4">
            <div className="flex flex-col w-full p-4 gap-2 bg-primary">
                <h1 className="text-4xl font-bold text-center text-white p-2">Order # {loaded ? orderInfo.order.id : null}</h1>
                <p className="text-white">Date Ordered: {loaded ? (new Date(orderInfo.createdAt).toLocaleString()) : null}</p>
                <p className="text-white">Customer Email: {loaded ? orderInfo.email : null} </p>
                <p className="text-white">Customer Username: {loaded ? orderInfo.username : null} </p>
            </div>
            
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="text-left">Item Name</th>
                        <th className="text-left">Price</th>
                        <th className="text-left">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {loaded ? orderInfo.order.orderItems.map((item, index) => {
                        return <tr key={index}>
                            <td>{item.product.name}</td>
                            <td>${item.product.price}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    }) : null}
                </tbody>
            </table>
            <div className="w-full">
                <h1 className="text-2xl">Total: ${loaded ? orderInfo.order.totalPrice : null}</h1>
            </div>
        </div>
        </ContentWrapper>
}

export default Invoice
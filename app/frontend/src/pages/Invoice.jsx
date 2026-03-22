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
    const [orderInfo, setOrderInfo] = useState([{name:"tomato", price:100, amount:2, total:200}])

    useEffect(() => {
        getInvoiceByOrderID(searchParams.get("id"))
            .then((res) => {
                setLoaded(true)
                setOrderInfo(res.data)
            })
    }, [])

    return <ContentWrapper>
        <div className="flex flex-col items-center align-middle gap-4 p-4">
            <div className="flex flex-col w-full p-4 gap-2 bg-primary">
                <h1 className="text-4xl font-bold text-center text-white p-2">Order Number {<RenderOnLoaded placeholder={"..."}></RenderOnLoaded>}</h1>
                <p className="text-white">Date Ordered: {<RenderOnLoaded placeholder={"..."}></RenderOnLoaded>}</p>
                <p className="text-white">Customer ID: {<RenderOnLoaded placeholder={"..."}></RenderOnLoaded>}</p>
                <p className="text-white">Customer email: {<RenderOnLoaded placeholder={"..."}></RenderOnLoaded>}</p>
            </div>
            
            <table className="w-full">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <RenderOnLoaded placeholder={<PlaceholderTableElement />}>
                        {orderInfo ?? orderInfo.map((item, index) => ( 
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>${item.price}</td>
                            <td>{item.amount}</td>
                            <td>${item.total}</td>
                        </tr>
                        ))}
                    </RenderOnLoaded>
                </tbody>
            </table>
        </div>
        </ContentWrapper>
}

export default Invoice
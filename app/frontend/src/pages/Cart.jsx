import { useContext, useEffect, useRef, useState } from "react"
import ContentWrapper from "../components/ContentWrapper"
import { getOrders, placeOrder } from "../api/orders.mjs"
import { CartContext } from "../components/CartContext"
import { useNavigate } from "react-router-dom"

const CartEmpty = () => {
    return <div>Your shopping cart is empty!</div>
}

const OrderEntry = ({ cartObject }) => {
    const [ quantity, setQuantity ] = useState(cartObject.quantity)
    const { addToCart, MAX_QUANTITY, updateCartItemQuantity, getCartItem, removeFromCart } = useContext(CartContext)

    const inputRef = useRef()

    const handleKeyDown = (event) => {
        if (event.key == 'Enter')
        {
            handleSubmit()
        }
    }

    const handleSubmit = () => {
        const inputToInt = parseInt(quantity);
        inputRef.current.blur()

        if (Number.isNaN(inputToInt) || inputToInt < 1)
        {
            updateCart(cartObject.item, 1)
            setQuantity(1)
            return
        }

        if (inputToInt > MAX_QUANTITY)
        {
            updateCart(cartObject.item, MAX_QUANTITY)
            setQuantity(MAX_QUANTITY)
            return
        }

        setQuantity(inputToInt)
    }

    const increaseQuantity = () => {
        if (quantity + 1 <= MAX_QUANTITY)
        {
            updateCart(cartObject.item, quantity + 1)
            setQuantity((val) => {return val + 1})
        }
    }

    const decreaseQuantity = () => {
        if (quantity > 0)
        {
            updateCart(cartObject.item, quantity - 1)
            setQuantity((val) => {return val - 1})
        }
    }

    const updateCart = (item, quantity) => {
        const storedCartItem = getCartItem(item.id)
        // Add the item to the cart if it doesn't exist
        if (!storedCartItem && quantity > 0) {
            addToCart(item, quantity)
            return
        }
        // Handle the case where the item is already in the cart
        if (quantity > 0){
            updateCartItemQuantity(item.id, quantity)
        }
        else if (quantity == 0 && storedCartItem){
            removeFromCart(item.id)
        }
    }

    return <li className="flex flex-row gap-1">
            <div className="flex flex-2 justify-center items-center">
                <img src={cartObject.item.image} className="h-fit"></img>
            </div>
            <div className="flex-2 text-xl text-center align-bottom">
                <h1 className="text-2xl text-dark">{cartObject.item.name}</h1>
                <p>{"$" + cartObject.item.price}</p>
            </div>
            <div className="flex-1">
                <div className="flex flex-row items-center justify-between gap-2 p-2">
                    <button className="text-4xl text-primary btn-interactive" onClick={decreaseQuantity}>{"<"}</button>
                    <input className="text-xl w-full text-center min-w-4" ref={inputRef} value={quantity} onKeyDown={handleKeyDown} onBlur={() => {handleSubmit()}} onChange={(e) => {setQuantity(e.target.value)}} />
                    <button className="text-4xl text-primary btn-interactive" onClick={increaseQuantity}>{">"}</button>
                </div>
            </div>
            <div className="flex flex-1 items-center justify-center">
                <button className="aspect-square size-10 rounded-lg text-2xl hover:text-red-500 text-primary-light cursor-pointer" onClick={() => {updateCart(cartObject.item, 0)}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" aria-label="Delete" role="img">
                    <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M9 9l6 6" />
                        <path d="M15 9l-6 6" />
                    </g>
                </svg>
                </button>
            </div>
        </li>
}

const OrderList = ({ cart }) => {
    return <div className="flex flex-3 flex-col p-2 bg-white rounded-md text-dark overflow-y-auto">
        <h2 className="text-4xl text-center">Your Items</h2>
        <ol className="flex flex-col gap-2">
            {cart.map((cartObject, index) => {
                return <OrderEntry key={index} cartObject={cartObject}></OrderEntry>
            })}
        </ol>
    </div>
}

const OrderSummary = ({ cart, clearCart, totalItems, total, orderComplete, setOrderComplete }) => {
    const orderButtonDisabled = totalItems == 0
    
    const navigate = useNavigate()

    const handlePlaceOrder = () => {
        setOrderComplete(false)
        const order = {
            orderItems: cart.map(cartObject => {return { productId: cartObject.item.id, quantity: cartObject.quantity }}), 
            totalPrice: total
        }

        placeOrder(order)
            .then(() => {
                clearCart()
                setOrderComplete(true)
                navigate("/orders")
            })
        
    }

    return <div className="flex flex-1 flex-col p-2 justify-between h-full bg-white rounded-md text-dark overflow-y-auto">
        <div>
            <h2 className="text-2xl text-center">Order Summary</h2>
            <ol className="flex flex-col gap-1" >
                {cart.map((cartObject, index) => {
                    return <li key={index}>{cartObject.quantity + " \"" + cartObject.item.name + "\" - $" + (cartObject.item.price * cartObject.quantity).toFixed(2)}</li>
                })}
            </ol>
        </div>
        <div>
            <div className="text-center text-2xl p-2">
                {"Total: $" + total.toFixed(2)}
            </div>
            <button 
                disabled={orderButtonDisabled} 
                onClick={handlePlaceOrder} className="bg-primary-light rounded-md p-2 text-3xl w-full btn-interactive">
                    {orderComplete ? "Place Order" : "..."}
            </button>
        </div>
    </div>
}

const Cart = () => {
    const { cart, clearCart, totalItems } = useContext(CartContext)
    const total = cart.reduce(
        (acc, curr) => acc + curr.item.price * curr.quantity,
        0
    )

    const [ orderComplete, setOrderComplete ] = useState(true)

    return <ContentWrapper>
            <h1 className="text-4xl text-center border-b font-bold">Shopping Cart</h1>
            <div className="flex flex-row gap-2 h-full">
                <OrderList cart={cart}></OrderList>
                <OrderSummary orderComplete={orderComplete} clearCart={clearCart} totalItems={totalItems} setOrderComplete={setOrderComplete} total={total} cart={cart}></OrderSummary>
            </div>
        </ContentWrapper>
}

export default Cart
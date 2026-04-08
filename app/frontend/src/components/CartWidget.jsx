import { useContext, useEffect, useRef } from "react";
import { CartContext } from "./CartContext";
import { IoCartOutline } from "react-icons/io5";

export default function CartWidget() {
    const { cart, showCart, setShowCart } = useContext(CartContext);

    const totalPrice = cart.reduce(
        (sum, c) => sum + c.item.price * c.quantity,
        0
    );
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setShowCart(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block" ref={wrapperRef}>

            {/* Cart Button */}
            <button
                onClick={() => setShowCart(prev => !prev)}
                className="bg-primary text-white rounded-full p-4 
                cursor-pointer shadow-lg transition-transform hover:scale-120"
            >
                <IoCartOutline className="w-6 h-6" />
            </button>

            {/* Dropdown Widget */}
            {showCart && (
                <div className="absolute bottom-full right-0 mb-3 w-80 bg-white rounded-lg shadow-xl p-4 z-50">

                    {/* Header */}
                    <div className="grid grid-cols-[2fr_1fr_1fr] text-sm font-semibold border-b pb-2">
                        <div>Name</div>
                        <div className="text-center">Qty</div>
                        <div className="text-right">Total</div>
                    </div>

                    {/* Rows */}
                    {cart.length === 0 && (
                        <div className="py-4 text-center text-sm text-gray-500">
                            Cart is empty
                        </div>
                    )}

                    {cart.map(orderItem => (
                        <div
                            key={orderItem.item.id}
                            className="grid grid-cols-[2fr_1fr_1fr] gap-2 py-2 border-b last:border-b-0 text-sm"
                        >
                            <div className="truncate">
                                {orderItem.item.name}
                            </div>
                            <div className="text-center">
                                {orderItem.quantity}
                            </div>
                            <div className="text-right">
                                ${(orderItem.item.price * orderItem.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}

                    {/* Total */}
                    {cart.length > 0 && (
                        <div className="text-right font-bold pt-3 text-sm">
                            Total: ${totalPrice.toFixed(2)}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

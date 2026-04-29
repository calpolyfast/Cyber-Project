import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext";
import { CartContext } from "./CartContext";
import { IoIosLogOut } from "react-icons/io";

const NavBar = () => {
    const { isAuthenticated, loaded, logout } = useContext(AuthContext)
    const { clearCart } = useContext(CartContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/")

        // Clear the shopping cart on logout to prevent confusion and potential issues with stale cart data
        clearCart()

        alert("Logout successful!")
    }
    
    return <nav className="border-b border-white items-center cursor-pointer justify-between sticky top-0 left-0 p-4 bg-primary text-dark w-full text-2xl sm:flex hidden">
        <a href="/">
            Home
            {/*Home Button Image*/}
            <img></img>
        </a>
        <ul className="flex flex-row gap-4 items-center">
            <a href="/about">About Us</a>
            <a href="/shopping-cart">Cart</a>
            <a href="/orders">Orders</a>
            <div className={`${!loaded ? "animate-pulse" : ""} flex bg-white rounded-lg p-2 min-w-35 justify-center`}>
                <a href="/account">{!loaded ? "..." : isAuthenticated ? "Account" : "Sign In"}</a>
            </div>
            {isAuthenticated && (
                <button className="btn-interactive" onClick={handleLogout}>
                    <IoIosLogOut className="text-4xl text-white" />
                </button>
            )}
        </ul>
    </nav>
}

export default NavBar;
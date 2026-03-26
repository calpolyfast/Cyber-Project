import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const MobileNav = () => {
    const { isAuthenticated } = useContext(AuthContext)

    return <nav className="justify-between items-center sticky bottom-0 left-0 p-4 bg-primary text-dark w-full text-2xl flex sm:hidden">
        <a href="/">Home</a>
        <a href="/about">About Us</a>
        <a href="/shopping-cart">Cart</a>
        <a href="/orders">Orders</a>
        <div className="flex bg-white rounded-lg p-2 min-w-35 justify-center">
            <a href="/account">{isAuthenticated ? "Account" : "Sign In"}</a>
        </div>
    </nav>
}

export default MobileNav;
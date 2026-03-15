import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const NavBar = () => {
    const { isAuthenticated, loaded } = useContext(AuthContext)
    
    return <nav className="border-b border-white items-center justify-between sticky top-0 left-0 p-4 bg-primary text-dark w-full text-2xl sm:flex hidden">
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
        </ul>
    </nav>
}

export default NavBar;
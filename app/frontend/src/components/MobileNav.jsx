import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext";
import { CartContext } from "./CartContext";
import { IoIosLogOut } from "react-icons/io";
import { MdMenu } from "react-icons/md";

const MobileNav = () => {
    const [showMenu, setShowMenu] = useState(false)
    const { isAuthenticated, loaded, logout } = useContext(AuthContext)
    const { clearCart } = useContext(CartContext)
    const menuRef = useRef()
    const navigate = useNavigate()

    const closeMenu = () => { setShowMenu(false) }

    const handleLogout = () => {
        logout()
        closeMenu()
        navigate("/")

        // Clear the shopping cart on logout to prevent confusion and potential issues with stale cart data
        clearCart()

        alert("Logout successful!")
    }

    useEffect(() => {
        // Close the menu when navigating to a different page and when user clicks out
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false)
            }
        }

        window.addEventListener("click", handleClickOutside)

        return () => {
            window.removeEventListener("click", handleClickOutside)
        }
    }, [showMenu]);

    return <nav className="relative flex sm:hidden justify-between items-center bottom-0 left-0 p-4 bg-primary text-dark w-full text-2xl">
        <a href="/">Home</a>
        <div className="btn-interactive" ref={menuRef}>
            <MdMenu className="text-4xl text-white" onClick={() => setShowMenu((val) => !val)} />
            { showMenu && (
                <ul className="absolute bottom-full left-0 right-0 flex flex-col bg-primary-light">
                    <li className="border-b border-white p-2">
                        <a href="/about" onClick={closeMenu}>About Us</a>
                    </li>
                    <li className="border-b border-white p-2">
                        <a href="/shopping-cart" onClick={closeMenu}>Cart</a>
                    </li>
                    <li className="border-b border-white p-2">
                        <a href="/orders" onClick={closeMenu}>Orders</a>
                    </li>
                    <li className="border-b border-white p-2">
                        <a href="/account" onClick={closeMenu}>
                            {!loaded ? "..." : isAuthenticated ? "Account" : "Sign In"}
                        </a>
                    </li>
                    {isAuthenticated && (
                        <li className="border-b border-white p-2">
                            <button className="btn-interactive" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </div>
    </nav>
}

export default MobileNav;
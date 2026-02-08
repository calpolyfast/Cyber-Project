const NavBar = () => {
    return <nav className="flex border-b border-white justify-between sticky top-0 left-0 p-4 bg-primary-light text-primary w-full text-2xl">
        <a href="/">
            Home
            {/*Home Button Image*/}
            <img></img>
        </a>
        <ul className="flex flex-row gap-4">
            <a href="/about">About Us</a>
            <a href="/shopping-cart">Cart</a>
            <a href="/orders">Orders</a>
            <a href="/account">Account</a>
        </ul>
    </nav>
}

export default NavBar;
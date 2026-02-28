import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Cart from "./pages/Cart"
import NavBar from "./components/NavBar"
import Admin from "./pages/Admin"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Account from "./pages/Account"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./components/AuthContext"
import { CartProvider } from "./components/CartContext"
import Orders from "./pages/Orders"
import Product from "./pages/Product"

function App() {
  return (
    <Router>
        <AuthProvider>
            <CartProvider>
                <main className="full-screen">
                    <NavBar></NavBar>
                    <Routes>
                        <Route index element={
                            <Home />
                        } />
                        <Route path={"/product/:productId"} element={
                            <Product />
                        } />
                        <Route path={"/about"} element={
                            <About />
                        } />
                        <Route path={"/shopping-cart"} element={
                            <Cart />
                        } />
                        <Route path={"/admin"} element={
                            <Admin />
                        } />
                        <Route path={"/login"} element={
                            <Login />
                        } />
                        <Route path={"/register"} element={
                            <Register />
                        } />
                        <Route path={"/account"} element={
                            <ProtectedRoute><Account /></ProtectedRoute>
                        } />
                        <Route path={"/orders"} element={
                            <ProtectedRoute><Orders /></ProtectedRoute>
                        } />
                    </Routes>
                </main>
            </CartProvider>
        </AuthProvider>
    </Router>
  )
}

export default App

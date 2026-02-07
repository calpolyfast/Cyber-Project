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

function App() {
  return (
    <Router>
        <AuthProvider>
            <CartProvider>
                <NavBar></NavBar>
                <div className="flex flex-col mx-8 md:mx-32">
                    <Routes>
                        <Route index element={
                            <Home />
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
                    </Routes>
                </div>
            </CartProvider>
        </AuthProvider>
    </Router>
  )
}

export default App

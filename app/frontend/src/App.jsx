import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Cart from "./pages/Cart"
import NavBar from "./components/NavBar"

function App() {
  return (
    <Router>
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
            </Routes>
        </div>
    </Router>
  )
}

export default App

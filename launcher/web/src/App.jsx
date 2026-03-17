import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/Home"

function App() {
  return (
    <Router>
        <div className="flex flex-col h-svh w-svw">
            <Routes>
                <Route index element={<Home />} />
            </Routes>
        </div>
    </Router>
  )
}

export default App

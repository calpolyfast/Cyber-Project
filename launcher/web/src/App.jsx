import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"

function App() {
  return (
    <main className="h-screen w-screen flex flex-row justify-stretch items-stretch overflow-y-auto">
      <div className="flex bg-secondary h-full w-0 md:w-10"></div>
      <div className="flex bg-white h-full w-20"></div>
      <div className="flex flex-10">
        <Router>
            <Routes>
                <Route index element={<Home />} />
            </Routes>
        </Router>
      </div>
      <div className="flex bg-white h-full w-20"></div>
      <div className="flex bg-secondary h-full w-0 md:w-10"></div>
    </main>
    
  )
}

export default App

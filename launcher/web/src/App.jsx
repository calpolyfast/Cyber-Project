import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Labs from "./pages/Labs"
import Flags from "./pages/Flags"
import { AppProvider } from "./context/AppContext"

function App() {
  return (
    <AppProvider>
      <main className="h-screen w-screen flex flex-row justify-stretch items-stretch overflow-y-auto">
        <div className="flex bg-primary h-full w-20"></div>
        <div className="flex flex-1 bg-white text-gray-600">
          <Router>
              <Routes>
                  <Route index element={<Home />} />
                  <Route path="/labs" element={<Labs />} />
                  <Route path="/flags" element={<Flags />} />
              </Routes>
          </Router>
        </div>
        <div className="flex bg-primary h-full w-20"></div>
      </main>
    </AppProvider>
  )
}

export default App

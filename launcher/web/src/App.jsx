import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Labs from "./pages/Labs"
import Flags from "./pages/Flags"
import { AppProvider } from "./context/AppContext"

function App() {
  return (
    <AppProvider>
      <main className="relative min-h-screen max-w-screen flex flex-row overflow-y-auto">
        <div className="flex items-center justify-center bg-primary min-h-full w-full">
          <div className="flex w-[80%] min-h-full bg-white text-gray-600">
            <Router>
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="/labs" element={<Labs />} />
                    <Route path="/flags" element={<Flags />} />
                </Routes>
            </Router>
          </div>
        </div>
      </main>
    </AppProvider>
  )
}

export default App

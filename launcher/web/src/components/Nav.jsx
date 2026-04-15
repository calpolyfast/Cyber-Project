import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import flags from "../flags.json"

export default function Nav() {
    const navigate = useNavigate()
    const { foundFlags } = useContext(AppContext)
    const totalFlags = flags.length
    return (
        <nav className="flex justify-between items-center w-[80%]">
            <button 
                className="w-fit font-bold font-serif p-2 border border-secondary text-xl rounded-sm cursor-pointer
                            transform hover:scale-110 transition-transform duration-300 ease-in-out" 
                onClick={() => navigate("/")}
            >
                Back Home
            </button>
            <div className="w-fit font-bold font-serif p-2 border bg-primary text-white rounded-sm" >
                Flags: { foundFlags.length } / { totalFlags }
            </div>
        </nav>
    )
}
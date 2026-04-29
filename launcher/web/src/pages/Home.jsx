import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendLinkPayload } from "../api/payloads.mjs";
import { createChamber, deleteChamber } from "../api/chambers.mjs";
import { FaFlag, FaStoreAlt } from "react-icons/fa"
import { FaComputer } from "react-icons/fa6"
import { AppContext } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
    const { chamberId, setChamberId, clearFlags } = useContext(AppContext)
    const [creatingChamber, setCreatingChamber] = useState(false)
    const [deletingChamber, setDeletingChamber] = useState(false)

    const handleCreateChamber = async () => {
        setCreatingChamber(true)
        try {
            const res = await createChamber()
            const id = res.data.id
            setChamberId(id)
            sessionStorage.setItem("FAST-chamberId", JSON.stringify(id))

            const base = import.meta.env.VITE_CHAMBER_URL || "localhost:3000";
            const protocol = "http";
            const url = `${protocol}://${id}.${base}`;

            window.open(url, "_blank", "noopener,noreferrer");
        }
        catch(err){
            console.error(err)
        }
        finally {
            setCreatingChamber(false)
        }
    }

    const handleDeleteChamber = async () => {
        setDeletingChamber(true)
        try {
            const res = await deleteChamber()
            console.log(res.data.message)

            // Clear the local chamber state
            setChamberId(null)
            sessionStorage.removeItem("FAST-chamberId")
            clearFlags()
        }
        catch(err){
            console.error(err)
        }
        finally {
            setDeletingChamber(false)
        }
    }

    return <div className="flex flex-col justify-evenly w-full h-full py-8 bg-white text-gray-800">
        <header className="flex flex-col items-center font-serif px-8 gap-4">
            <h1 className="text-6xl text-center"> FAST Cyber Pentesting Lab </h1>
            <h3 className="text-4xl text-center"> Cyber Security Research Team </h3>
        </header>
        <div className="flex justify-center">
            { chamberId &&
                <nav className="flex flex-col items-center gap-4">
                    <button 
                        className="flex items-center p-2 gap-2 w-fit font-bold font-serif border bg-secondary text-white text-xl rounded-sm 
                                    cursor-pointer transform hover:scale-110 transition-transform duration-300 ease-in-out" 
                        onClick={handleDeleteChamber}
                        disabled={deletingChamber}
                    >
                        { !deletingChamber ? "Exit Chamber" : "Exiting..."}
                        { deletingChamber && <LoadingSpinner /> }
                    </button>
                    <div className="w-fit font-bold font-serif p-2 border border-secondary text-xl rounded-sm">
                        <h2 className="text-md"> Chamber ID: { chamberId } </h2>
                    </div>
                </nav>
            }
            { !chamberId && 
                <button 
                    className="flex items-center p-2 gap-2 w-fit font-bold font-serif border border-secondary text-xl rounded-sm 
                                cursor-pointer transform hover:scale-110 transition-transform duration-300 ease-in-out" 
                    onClick={handleCreateChamber}
                    disabled={creatingChamber}
                >
                    { !creatingChamber ? "Launch New Chamber" : "Launching..."}
                    { creatingChamber && <LoadingSpinner /> }
                </button>
            }
        </div>
        <div className="flex justify-center w-full">
            <div className="flex flex-row gap-x-5 lg:gap-x-15 2xl:gap-x-40">
                <NavButton destination="store" />
                <NavButton destination="labs" />
                <NavButton destination="flags" />
            </div>
        </div>
    </div>
}

function NavButton({ destination }) {
    const { chamberId } = useContext(AppContext)
    const navigate = useNavigate()

    if(destination === "store") {
        // Navigate directly to the redirect api route   
        const handleNavigate = async () => {
            window.open("/api/redirect", "_blank")
        }

        const chamberExists = chamberId ? true : false

        return (
            <div
                onClick={chamberExists ? handleNavigate : null}
                className={`flex flex-col items-center gap-2
                transform transition-transform duration-300 ease-in-out
                ${!chamberId 
                    ? "opacity-50 cursor-not-allowed" 
                    : "cursor-pointer hover:scale-105"
                }`}
            >
                <h3 className="text-3xl text-center font-serif">Farm Store</h3>

                <div className="flex justify-center items-center h-30 md:h-35 lg:h-50 aspect-square bg-white rounded-md border border-secondary">
                    <div className="h-[80%] aspect-square">
                        <FaStoreAlt className="text-gray-700 h-full w-full" />
                    </div>
                </div>
            </div>
        );
    }
    if(destination === "labs") {   
        const handleNavigate = () => {
            navigate("/labs")
        }
        return (
            <div className="flex flex-col items-center gap-2 cursor-pointer
                            transform hover:scale-105 transition-transform duration-300 ease-in-out"
                            onClick={handleNavigate}
            >
                <h3 className="text-3xl text-center font-serif"> Labs </h3>
                <div className="flex justify-center items-center h-30 md:h-35 lg:h-50 aspect-square bg-white rounded-md border border-secondary">
                    <div className="h-[80%] aspect-square">
                        <FaComputer className="text-gray-700 h-full w-full"/>
                    </div>
                </div>
            </div>
        )
    }
    if(destination === "flags") {   
        const handleNavigate = () => {
            navigate("/flags")
        }
        return (
            <div className="flex flex-col items-center gap-2 cursor-pointer
                            transform hover:scale-105 transition-transform duration-300 ease-in-out"
                            onClick={handleNavigate}
            >
                <h3 className="text-3xl text-center font-serif"> Flags </h3>
                <div className="flex justify-center items-center h-30 md:h-35 lg:h-50 aspect-square bg-white rounded-md border border-secondary">
                    <div className="h-[80%] aspect-square">
                        <FaFlag className="text-gray-700 h-full w-full"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;
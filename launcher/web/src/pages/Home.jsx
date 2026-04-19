import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendLinkPayload } from "../api/payloads.mjs";
import { createChamber } from "../api/chambers.mjs";
import { FaFlag, FaStoreAlt } from "react-icons/fa"
import { FaComputer } from "react-icons/fa6"
import { AppContext } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
    const { chamberId, setChamberId } = useContext(AppContext)
    const [loadingChamber, setLoadingChamber] = useState(false)

    const handleCreateChamber = async () => {
        setLoadingChamber(true)
        try {
            const res = await createChamber()
            const id = res.data.id
            setChamberId(id)
            sessionStorage.setItem("FAST-chamberId", JSON.stringify(id))

            const base = import.meta.env.VITE_CHAMBER_URL || "localhost:3000";
            const protocol = base.includes("localhost") ? "http" : "https";
            const url = `${protocol}://${id}.${base}`;

            window.open(url, "_blank", "noopener,noreferrer");
        }
        catch(err){
            console.error(err)
        }
        finally {
            setLoadingChamber(false)
        }
    }

    return <div className="flex flex-col gap-4 justify-evenly w-full h-full py-8 bg-white text-gray-800">
        <header className="flex flex-col items-center font-serif px-8 gap-4">
            <h1 className="text-6xl text-center"> FAST Cyber Pentesting Lab </h1>
            <h3 className="text-4xl text-center"> Cyber Security Research Team </h3>
        </header>
        <div className="flex justify-center">
            { chamberId &&
                <div className="w-fit font-bold font-serif p-2 border border-secondary text-xl rounded-sm">
                    <h2 className="text-md"> Chamber ID: { chamberId } </h2>
                </div>
            }
            { !chamberId && 
                <button 
                    className="flex items-center p-2 gap-2 w-fit font-bold font-serif border border-secondary text-xl rounded-sm 
                                cursor-pointer transform hover:scale-110 transition-transform duration-300 ease-in-out" 
                    onClick={handleCreateChamber}
                    disabled={loadingChamber}
                >
                    { !loadingChamber ? "Launch New Chamber" : "Launching..."}
                    { loadingChamber && <LoadingSpinner /> }
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

    if(destination === "store") {   
        const chamberUrl = chamberId ? `http://${chamberId}.${import.meta.env.VITE_CHAMBER_URL}` : import.meta.env.VITE_CHAMBER_URL || "localhost:3000"
        const Wrapper = chamberId ? 'a' : 'div';
        console.log(chamberUrl)

        return (
            <Wrapper
                {...(chamberId && {
                href: chamberUrl,
                target: "_blank",
                rel: "noopener noreferrer"
                })}
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
        </Wrapper>
        );
    }
    if(destination === "labs") {   
        return (
            <a href="/labs" className="flex flex-col items-center gap-2 cursor-pointer
                            transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <h3 className="text-3xl text-center font-serif"> Labs </h3>
                <div className="flex justify-center items-center h-30 md:h-35 lg:h-50 aspect-square bg-white rounded-md border border-secondary">
                    <div className="h-[80%] aspect-square">
                        <FaComputer className="text-gray-700 h-full w-full"/>
                    </div>
                </div>
            </a>
        )
    }
    if(destination === "flags") {   
        return (
            <a href="/flags" className="flex flex-col items-center gap-2 cursor-pointer
                            transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <h3 className="text-3xl text-center font-serif"> Flags </h3>
                <div className="flex justify-center items-center h-30 md:h-35 lg:h-50 aspect-square bg-white rounded-md border border-secondary">
                    <div className="h-[80%] aspect-square">
                        <FaFlag className="text-gray-700 h-full w-full"/>
                    </div>
                </div>
            </a>
        )
    }
}

export default Home;
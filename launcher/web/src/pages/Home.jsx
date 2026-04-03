import { useState } from "react";
import { sendLinkPayload } from "../api/payloads.mjs";
import { createChamber } from "../api/chambers.mjs";
import { FaFlag, FaStoreAlt } from "react-icons/fa"
import { FaComputer } from "react-icons/fa6"

const Home = () => {
    const [ chamberID, setChamberID ] = useState("")
    const [ payload, setPayload ] = useState("")
    const [ resMessage, setResMessage ] = useState("")

    const handleDemoPayload = (e) => {
        e.preventDefault()
        sendLinkPayload(chamberID, payload)
            .then((res) => {
                setResMessage(res.data.data)
            })
    }

    const handleCreateChamber = async () => {
        try {
            const res = await createChamber()
            console.log(res)
        }
        catch(err){
            console.error(err)
        }
    }

    return <div className="flex flex-col justify-evenly w-full h-full py-8 bg-primary text-white">
        <header className="flex flex-col items-center font-serif px-8 gap-4">
            <h1 className="text-6xl text-center"> FAST Cyber Pentesting Lab </h1>
            <h3 className="text-4xl text-center"> Cyber Security Research Team </h3>
        </header>
        <div className="flex justify-center">
            <button 
                className="w-fit font-bold font-serif p-2 bg-secondary text-xl rounded-sm cursor-pointer
                            transform hover:scale-110 transition-transform duration-300 ease-in-out" 
                onClick={handleCreateChamber}
            >
                Launch New Chamber
            </button>
        </div>
        <div className="flex justify-center w-full">
            <div className="flex md:hidden flex-col items-stretch gap-y-8">
                <div className="flex flex-row gap-20 w-full">
                    <div className="flex flex-col items-center gap-2 cursor-pointer
                                transform hover:scale-105 transition-transform duration-300 ease-in-out">
                        <h3 className="text-3xl text-center font-serif"> Farm Store </h3>
                        <div className="flex justify-center items-center h-30 md:h-35 lg:h-50 aspect-square bg-white rounded-md border border-gray-300">
                            <div className="h-[80%] aspect-square">
                                <FaStoreAlt className="text-black h-full w-full"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 cursor-pointer
                            transform hover:scale-105 transition-transform duration-300 ease-in-out">
                        <h3 className="text-3xl text-center font-serif"> Labs </h3>
                        <div className="flex justify-center items-center h-30 md:h-35 lg:h-50 aspect-square bg-white rounded-md border border-gray-300">
                            <div className="h-[80%] aspect-square">
                                <FaComputer className="text-black h-full w-full"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-center">
                    <div className="flex flex-col items-center gap-2 cursor-pointer
                            transform hover:scale-105 transition-transform duration-300 ease-in-out">
                        <h3 className="text-3xl text-center font-serif"> Check Flags </h3>
                        <div className="flex justify-center items-center h-30 md:h-35 lg:h-50 aspect-square bg-white rounded-md border border-gray-300">
                            <div className="h-[80%] aspect-square">
                                <FaFlag className="text-black h-full w-full"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden md:flex md:flex-row gap-x-5 lg:gap-x-15 2xl:gap-x-40">
                <div className="flex flex-col items-center gap-2 cursor-pointer
                            transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <h3 className="text-3xl text-center font-serif"> Farm Store </h3>
                    <div className="flex justify-center items-center h-30 md:h-35 lg:h-50 aspect-square bg-white rounded-md border border-gray-300">
                        <div className="h-[80%] aspect-square">
                            <FaStoreAlt className="text-black h-full w-full"/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2 cursor-pointer
                            transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <h3 className="text-3xl text-center font-serif"> Labs </h3>
                    <div className="flex justify-center items-center h-30 md:h-35 lg:h-50 aspect-square bg-white rounded-md border border-gray-300">
                        <div className="h-[80%] aspect-square">
                            <FaComputer className="text-black h-full w-full"/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2 cursor-pointer
                            transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <h3 className="text-3xl text-center font-serif"> Check Flags </h3>
                    <div className="flex justify-center items-center h-30 md:h-35 lg:h-50 aspect-square bg-white rounded-md border border-gray-300">
                        <div className="h-[80%] aspect-square">
                            <FaFlag className="text-black h-full w-full"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Home;
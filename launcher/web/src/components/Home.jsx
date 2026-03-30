import { useState } from "react";
import { sendLinkPayload } from "../api/payloads.mjs";
import { createNewChamber } from "../api/chambers.mjs";

// "chamber-test-2-id-c5cbbc774-j2m7t", "http://test-2-id.localhost:3000/?search=%253Cimg%2520src%253D%2522%2522%2520onerror%253D%2522alert%281%29%2522%253E"

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

    const handleLaunch = async () => {
        try {
            const res = await createNewChamber()
            console.log(res.data)
        }
        catch(err) {
            console.error(err)
        }
    }

    return <div className="flex bg-primary justify-center w-full h-full">
        <div className="flex h-full flex-col gap-2 p-4 items-center bg-white">
            <div className="flex-1 text-6xl font-serif">
                FAST Cyber Pentesting Lab
            </div>
            <div className="flex flex-2 flex-col gap-2">
                <button className="font-bold font-serif p-2 hover:bg-primary bg-[#888] text-black hover:text-white text-xl rounded-sm" onClick={handleLaunch}>Launch</button>
                <button onClick={handleLaunch} className="font-bold font-serif p-2 hover:bg-primary bg-[#888] text-black hover:text-white text-xl rounded-sm">Launch</button>
                <form onSubmit={handleDemoPayload} className="flex flex-col gap-1 border rounded-sm p-1">
                    <h1>XSS Payload Demo</h1>
                    <input type="text" placeholder="Instance ID" onChange={(e) => {setChamberID(e.target.value)}} className="bg-gray-400 p-4 rounded-md" />
                    <input type="text" placeholder="Payload" onChange={(e) => {setPayload(e.target.value)}} className="bg-gray-400 p-4 rounded-md" />
                    <button name="submit" className="font-bold font-serif p-2 hover:bg-primary bg-[#888] text-black hover:text-white text-xl rounded-sm">Send Payload</button>
                    <p className="h-4 m-2">{resMessage}</p>
                </form>
            </div>
        </div>
    </div>
}

export default Home;
import { useState } from "react"
import { sendLinkPayload } from "../api/payloads.mjs"

export default function XSSLab() {
    const [ resMessage, setResMessage ] = useState("")
    const [payload, setPayload] = useState("")
    const [chamberID, setChamberID] = useState("")

    const handleDemoPayload = (e) => {
        e.preventDefault()
        sendLinkPayload(chamberID, payload)
            .then((res) => {
                setResMessage(res.data.data)
            })
    }

    return (
        <form onSubmit={handleDemoPayload} className="flex flex-col justify-evenly w-full gap-2 border rounded-sm p-4">
            <h2 className="text-3xl font-serif">XSS Payload Demo</h2>
            <input type="text" placeholder="Instance ID" onChange={(e) => {setChamberID(e.target.value)}} className="bg-gray-400 p-4 rounded-md" />
            <input type="text" placeholder="Payload" onChange={(e) => {setPayload(e.target.value)}} className="bg-gray-400 p-4 rounded-md" />
            <button name="submit" className="font-bold font-serif p-2 hover:bg-primary bg-[#888] text-black hover:text-white text-xl rounded-sm">Send Payload</button>
            { resMessage && <p className="h-4 m-2 text-2xl">{resMessage} </p> }
        </form>
    )
}   
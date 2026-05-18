import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"
import { sendHTMLPayload } from "../api/payloads.mjs"
import LoadingSpinner from "./LoadingSpinner"

export default function CSRFLab() {
    const { chamberId } = useContext(AppContext)
    const [resMessage, setResMessage ] = useState([])
    const [payload, setPayload] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSendPayload = (e) => {
        e.preventDefault()
        if (chamberId === null) {
            alert("You must be associated with an active chamber to send a payload")
            return
        }
        if (!payload) {
            alert("Please enter a payload before submitting")
            return
        }
        setLoading(true)
        sendHTMLPayload(payload)
            .then((res) => {
                setResMessage(res.data.data.split("\n"))
                const match = res.data.data.match(/flag[^\n]*/);
                if (match) {
                    alert("Congratulations! You found a flag: " + match[0])
                }
            })
            .catch((err) => {
                alert("An error occurred while sending the payload")
                console.error("error:", err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <form onSubmit={handleSendPayload} className="flex flex-col justify-evenly w-full gap-2 border rounded-sm p-4">
            <h2 className="text-3xl font-serif">CSRF Payload Sender</h2>
            <div className="bg-gray-400 p-4 rounded-md" >
                { chamberId || "No Instance ID registered" }
            </div>
            <textarea type="text" placeholder="Payload" onChange={(e) => {setPayload(e.target.value)}} className="grow bg-gray-400 text-wrap p-4 rounded-md w-full overflow-y-visible h-80" />
            <button
                name="submit"
                className={`
                    flex justify-center items-center gap-x-2
                    font-bold font-serif p-2 text-xl rounded-sm
                    transition-colors

                    ${
                    chamberId === null
                        ? "bg-[#888] text-black cursor-not-allowed"
                        : "bg-[#888] text-black cursor-pointer hover:bg-primary hover:text-white"
                    }
                `}
                >
                Send Payload
                { loading && <LoadingSpinner />}
            </button>
            <div className="flex flex-col gap-y-2">
                {resMessage && resMessage.map((line, index) => (
                    <p key={index} className="text-2xl">
                        {line}
                    </p>
                ))}
            </div>
        </form>
    )
}   
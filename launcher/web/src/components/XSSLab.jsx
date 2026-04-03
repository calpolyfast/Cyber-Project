export default function XSSLab() {
    <form onSubmit={handleDemoPayload} className="flex flex-col gap-1 border rounded-sm p-1">
        <h1>XSS Payload Demo</h1>
        <input type="text" placeholder="Instance ID" onChange={(e) => {setChamberID(e.target.value)}} className="bg-gray-400 p-4 rounded-md" />
        <input type="text" placeholder="Payload" onChange={(e) => {setPayload(e.target.value)}} className="bg-gray-400 p-4 rounded-md" />
        <button name="submit" className="font-bold font-serif p-2 hover:bg-primary bg-[#888] text-black hover:text-white text-xl rounded-sm">Send Payload</button>
        <p className="h-4 m-2">{resMessage}</p>
    </form>
}
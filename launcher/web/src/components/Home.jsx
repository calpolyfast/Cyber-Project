const Home = () => {
    return <div className="flex bg-primary justify-center w-full h-full">
        <div className="flex h-full flex-col gap-2 p-4 items-center bg-white">
            <div className="flex-1 text-6xl font-serif">
                FAST Cyber Pentesting Lab
            </div>
            <div className="flex-2">
                <button className="font-bold font-serif p-2 hover:bg-primary bg-[#888] text-black hover:text-white text-xl rounded-sm">Launch</button>
            </div>
        </div>
    </div>
}

export default Home;
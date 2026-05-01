import XSSLab from "../components/XSSLab";
import CSRFLab from "../components/CSRFLab";
import Nav from "../components/Nav"

export default function Labs() {
    return (
        <div className="flex flex-col justify-evenly items-center w-full h-full gap-y-8 py-8 overflow-y-auto">
            <header className="flex flex-col items-center font-serif px-8 gap-4">
                <h1 className="text-6xl text-center"> Labs </h1>
            </header>
            <div className="flex flex-col w-[80%] gap-y-8">
                <XSSLab />
                <CSRFLab />
            </div>
            <Nav />
        </div>
    )
}
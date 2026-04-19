import XSSLab from "../components/XSSLab";
import Nav from "../components/Nav"
import CSRFLab from "../components/CSRFLab";

export default function Labs() {
    return (
        <div className="flex flex-col justify-evenly items-center w-full h-full py-8">
            <header className="flex flex-col items-center font-serif px-8 gap-4">
                <h1 className="text-6xl text-center"> Labs </h1>
            </header>
            <div className="flex flex-col w-[80%] gap-2">
                <XSSLab />
                <CSRFLab />
            </div>
            <Nav />
        </div>
    )
}
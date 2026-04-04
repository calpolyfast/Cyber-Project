import { useContext, useMemo } from "react"
import { AppContext } from "../context/AppContext"
import allFlags from "../flags.json"
import { PiSmileySadDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function Flags() {
    const navigate = useNavigate()
    const { foundFlags, updateFlag } = useContext(AppContext)
    const flags = useMemo(() => {
        return allFlags.map(flag => {
            const found = foundFlags !== undefined && foundFlags.includes(flag.id)
            return { ...flag, found }
        })
    }, [foundFlags])
    const collectedFlags = flags.filter(f => f.found)

    return (
        <div className="flex flex-col justify-evenly items-center w-full h-full gap-y-10 py-8 bg-white text-gray-700">
            <header className="flex flex-col items-center font-serif px-8 gap-4">
                <h1 className="text-6xl text-center"> Flags </h1>
            </header>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col w-[80%] min-w-50">
                    <h2 className="text-2xl"> All Flags </h2>
                    <ul className="flex flex-col border border-gray-500 rounded-md">
                        { flags.map(flag => (
                            <li key={flag.id} className="flex justify-between gap-x-4 border-b border-gray-500 last-of-type:border-0 p-4 ">
                                <label htmlFor={`flag-${flag.id}`}>{flag.name}</label>
                                <input 
                                    id={`flag-${flag.id}`}
                                    type="checkbox" 
                                    className="h-5 aspect-square" 
                                    checked={flag.found} 
                                    onChange={(e) => updateFlag(flag.id)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col w-[80%] min-w-50">
                    <header className="flex flex-row justify-between gap-4">
                        <h2 className="text-2xl"> Collected Flags </h2>
                        <ProgressBar current={foundFlags.length} total={allFlags.length} />
                    </header>
                    { collectedFlags.length === 0 && 
                        <div className="flex gap-x-2 justify-center items-center h-20 w-full border border-gray-500 rounded-md">
                            <PiSmileySadDuotone className="text-4xl" />
                            <p className="text-gray-500">No flags collected yet.</p>
                        </div>
                    }
                    { collectedFlags.length > 0 && 
                        <ul className="flex flex-col border border-gray-500 rounded-md">
                            { collectedFlags.map(flag => (
                                <li key={flag.id} className="flex justify-between gap-x-4 border-b border-gray-500 last-of-type:border-0 p-4 ">
                                    {flag.name}
                                </li>
                            ))}
                        </ul>
                    }
                    
                </div>
            </div>
            <nav className="flex justify-start w-[80%]">
                <button 
                    className="w-fit font-bold font-serif p-2 border border-secondary text-xl rounded-sm cursor-pointer
                                transform hover:scale-110 transition-transform duration-300 ease-in-out" 
                    onClick={() => navigate("/")}
                >
                    Back Home
                </button>
            </nav>
        </div>
    )
}

function ProgressBar({ current, total }) {
  const percentage = total === 0 ? 0 : Math.min((current / total) * 100, 100);

  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex w-30 h-4 border border-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span>{current} / {total}</span>
    </div>
  );
}

import { createContext, useEffect, useState } from "react";

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [chamberId, setChamberId] = useState(null)
    const [foundFlags, setFoundFlags] = useState([])

    useEffect(() => {
        sessionStorage.setItem("FAST-foundFlags", JSON.stringify(foundFlags));
    }, [foundFlags]);

    useEffect(() => {
        let stored = sessionStorage.getItem("FAST-chamberId");
        setChamberId(stored ? JSON.parse(stored) : null);
    })

    const updateFlag = (id) => {
        setFoundFlags(prevFlags => {
            const existingIndex = prevFlags.findIndex(
                flagId => flagId === id
            );

            // If flag is found, we remove it from the list (toggle behavior)
            if (existingIndex !== -1) {
                return prevFlags.filter((_, index) => index !== existingIndex);
            }
            // If flag is not found, we add it to the list
            else {
                return [...prevFlags, id];
            }
        });
    };

    const clearFlags = () => {
        setFoundFlags([]);
    };

    return (
        <AppContext.Provider
            value={{
                chamberId: chamberId,
                setChamberId: setChamberId,
                foundFlags: foundFlags,
                updateFlag: updateFlag,
                clearFlags: clearFlags,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

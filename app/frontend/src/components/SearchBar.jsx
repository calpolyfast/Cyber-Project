import { useEffect, useState } from "react";
import { getProducts, searchProduct } from "../api/products.mjs";

const SearchBar = ({ query, setQuery, setProducts }) => {
    const [input, setInput] = useState("")

    const decodedQuery = decodeURIComponent(query);

    useEffect(() => {
        getProducts()
            .then(({ data }) => {
                setProducts(data)
            })
    }, [])
    
    const handleChange = (e) => {
        const next = e.target.value;
        setInput(next);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setQuery((prev) => {
            const next = new URLSearchParams(prev);
            next.set("search", encodeURIComponent(input));
            return next;
        });
        setInput("");
    }

    return <div className="flex flex-row justify-end">
        <div className="flex-3/4" dangerouslySetInnerHTML={{__html: decodedQuery != "null" ? decodedQuery : ""}}></div> {/* This is where the server's response gets rendered */}
        <form onSubmit={handleSubmit} className="flex-1/2">
            <input onChange={handleChange} value={input} type="search" className="border rounded p-1" placeholder="Search..."></input>
        </form>
    </div>
}

export default SearchBar;
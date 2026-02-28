import { useEffect, useState } from "react";
import { getProducts, searchProduct } from "../api/products.mjs";
import { IoMdClose, IoMdSearch } from "react-icons/io";

const SearchBar = ({ query, setQuery, setProducts }) => {
    const [input, setInput] = useState("")

    const decodedQuery = decodeURIComponent(query);

    const clearSearch = () => {
        setQuery({})

        getProducts().then(res => {
            setProducts(res.data)
        }).catch(err => {
            // TODO: Show err
            console.error(err)
        })
    }
    
    const handleChange = (e) => {
        const next = e.target.value;
        setInput(next);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear the query if the input is empty
        if (input.trim().length == 0) {
            clearSearch()
            return
        }

        // Update the query
        setQuery((prev) => {
            const next = new URLSearchParams(prev);
            next.set("search", encodeURIComponent(input));
            return next;
        });

        searchProduct(input).then(res => {
            setProducts(res.data)
        }).catch(err => {
            // TODO: Show err
            console.error(err)
        })
        setInput("");
    }

    return <div className="flex flex-col-reverse gap-y-2 md:flex-row-reverse justify-between items-center w-full">
        
        <form onSubmit={handleSubmit} className="flex-end">
            <div className="flex flex-row border border-bg rounded overflow-clip">
                <span className="bg-bg flex p-1">
                    <button
                        type="submit"
                        className="cursor-pointer transition-transform hover:scale-120"
                    >
                        <IoMdSearch className="text-2xl text-white" />
                    </button>
                </span>
                <input 
                    onChange={handleChange} 
                    value={input}  
                    className="bg-white p-1 outline-none" 
                    placeholder="Search..."
                />
            </div>
        </form>

        { decodedQuery != "null" && <button className="flex justify-between items-center gap-x-2 
                        bg-white border-bg rounded p-1">
            <div className="flex-3/4" dangerouslySetInnerHTML={{__html: decodedQuery != "null" ? decodedQuery : ""}}></div> {/* This is where the server's response gets rendered */}
            <IoMdClose 
                className="text-primary text-2xl cursor-pointer transition-transform hover:scale-120"
                onClick={clearSearch}
            />
        </button> }
    </div>
}

export default SearchBar;
import { useContext, useEffect, useRef, useState } from 'react';
import banner_image from '../assets/placeholder.jpg';
import product_image from '../assets/product_placeholder.png';
import { getProducts, searchProduct } from '../api/products.mjs';
import SearchBar from '../components/SearchBar';
import { useSearchParams } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper';
import { CartContext } from '../components/CartContext';

import shoppingCartIcon from '../svg/shoppingcart.svg';

const ProductListing = ({ item }) => {
    const { addToCart, getCart, MAX_QUANTITY } = useContext(CartContext)
    const [ quantity, setQuantity ] = useState(1)
    const [ imageLoaded, setImageLoaded ] = useState(true)

    const inputRef = useRef()

    const handleKeyDown = (event) => {
        if (event.key == 'Enter')
        {
            handleSubmit()
        }
    }

    const handleSubmit = () => {
        const inputToInt = parseInt(quantity);
        inputRef.current.blur()

        if (Number.isNaN(inputToInt) || inputToInt < 1)
        {
            setQuantity(1)
            inputRef.current.value = 1
            return
        }

        if (inputToInt > MAX_QUANTITY)
        {
            setQuantity(MAX_QUANTITY)
            inputRef.current.value = MAX_QUANTITY
            return
        }

        setQuantity(inputToInt)
    }

    const increaseQuantity = () => {
        if (quantity + 1 <= MAX_QUANTITY)
        {
            inputRef.current.value = quantity + 1
            setQuantity((val) => {return val + 1})
        }
    }

    const decreaseQuantity = () => {
        if (quantity > 1)
        {
            inputRef.current.value = quantity - 1
            setQuantity((val) => {return val - 1})
        }
    }

    const handleAddToCart = () => {
        addToCart(item, quantity)
        console.log(getCart())
    }

    useEffect(() => {
        inputRef.current.value = 1
    }, [])

    return <div className="flex flex-col justify-between rounded-sm border-2 border-secondary gap-4 p-2 bg-white">
        <div>
            <div className="flex flex-col gap-1 m-1 font-sans">
                <h2 className="text-2xl font-bold">{item.name}</h2>
                <p>{item.description}</p>
                <div>
                    <p className="text-2xl font-bold">{"$" + item.price}</p>
                </div>
            </div>
            <div className="flex overflow-hidden w-full h-60 justify-center">
                { imageLoaded
                    ? <img src="https://placehold.co/100" className="flex-none w-[200px] h-[200px] max-w-none" onError={() => {setImageLoaded(false)}} alt="placeholder"></img>
                    : <div></div>
                }
            </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-row items-center justify-between gap-2 p-2 w-full">
                <button className="text-4xl" onClick={decreaseQuantity}>{"<"}</button>
                <input className="text-xl w-full text-center" ref={inputRef} onKeyDown={handleKeyDown} onBlur={() => {handleSubmit()}} onChange={(e) => {setQuantity(e.target.value)}} />
                <button className="text-4xl" onClick={increaseQuantity}>{">"}</button>
            </div>
            <button onClick={handleAddToCart} className="w-[50%] h-[50%] max-w-10 max-h-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"
                    aria-hidden="true" focusable="false">
                    <circle cx="9" cy="20" r="1"/>
                    <circle cx="18" cy="20" r="1"/>
                    <path d="M2 3h3l2.2 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L22 7H6"/>
                </svg>
            </button>
        </div>
    </div>
}

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [reflectedQuery, setReflectedQuery] = useState("");
    const [products, setProducts] = useState([]);
    
    // {
    //     name: "Product 1",
    //     image: product_image,
    //     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    //     price: "$0.00"
    // }

    return <ContentWrapper>
        <h1 className="text-4xl text-center border-b font-bold">Home Page</h1>
        <SearchBar query={searchParams.get("search")} setQuery={setSearchParams} setProducts={setProducts} />
        <div className="flex flex-col md:grid gap-4 grid-cols-4">{products.map((product, index) => {
            return <ProductListing key={index} item={product}/>
        })}</div>
    </ContentWrapper>
}

export default Home
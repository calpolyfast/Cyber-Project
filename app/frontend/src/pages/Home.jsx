import { useContext, useEffect, useRef, useState } from 'react';
import banner_image from '../assets/placeholder.jpg';
import product_image from '../assets/product_placeholder.png';
import { getProducts, searchProduct } from '../api/products.mjs';
import SearchBar from '../components/SearchBar';
import { Link, useSearchParams } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper';
import { CartContext } from '../components/CartContext';

import shoppingCartIcon from '../svg/shoppingcart.svg';
import CartWidget from '../components/CartWidget';

const PlaceholderListing = () => {
    return <div className="min-h-[448px] rounded-lg bg-white animate-pulse shadow-xl">
    </div>
}

const ProductListing = ({ item }) => {
    const { addToCart, updateCartItemQuantity, getCartItem, MAX_QUANTITY } = useContext(CartContext)
    const [ quantity, setQuantity ] = useState(0)
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
            updateCart(item, 1)
            setQuantity(1)
            return
        }

        if (inputToInt > MAX_QUANTITY)
        {
            updateCart(item, MAX_QUANTITY)
            setQuantity(MAX_QUANTITY)
            return
        }

        setQuantity(inputToInt)
    }

    const increaseQuantity = () => {
        if (quantity + 1 <= MAX_QUANTITY)
        {
            updateCart(item, quantity + 1)
            setQuantity((val) => {return val + 1})
        }
    }

    const decreaseQuantity = () => {
        if (quantity > 0)
        {
            updateCart(item, quantity - 1)
            setQuantity((val) => {return val - 1})
        }
    }

    const updateCart = (item, quantity) => {
        const storedCartItem = getCartItem(item.id)
        // Add the item to the cart if it doesn't exist
        if (!storedCartItem && quantity > 0) {
            addToCart(item, quantity)
            return
        }
        // Handle the case where the item is already in the cart
        if (quantity > 0){
            updateCartItemQuantity(item.id, quantity)
        }
        else if (quantity == 0 && storedCartItem){
            removeFromCart(item.id)
        }
    }

    useEffect(() => {
        const currentQuantity = getCartItem(item.id)?.quantity
        currentQuantity ? setQuantity(currentQuantity) : setQuantity(0)
    }, [])

    return <div className="flex flex-col justify-between rounded-lg gap-4 p-2 bg-white shadow-xl">
        <div>
            <div className="flex flex-col gap-1 m-1 font-sans">
                <Link to={`/product/${item.id}`}>
                    <h2 className="text-2xl font-bold hover:underline hover:text-primary">{item.name}</h2>
                </Link>
                <p>{item.description}</p>
                <div>
                    <p className="text-2xl font-bold">{"$" + Number(item.price).toFixed(2)}</p>
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
                <button className="text-4xl cursor-pointer" onClick={decreaseQuantity}>{"<"}</button>
                <input className="text-xl w-full text-center" ref={inputRef} value={quantity} onKeyDown={handleKeyDown} onBlur={() => {handleSubmit()}} onChange={(e) => {setQuantity(e.target.value)}} />
                <button className="text-4xl cursor-pointer" onClick={increaseQuantity}>{">"}</button>
            </div>
            <div className="w-[50%] h-[50%] max-w-10 max-h-10 cursor-pointer">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true" focusable="false">
                    <circle cx="9" cy="20" r="1"/>
                    <circle cx="18" cy="20" r="1"/>
                    <path d="M2 3h3l2.2 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L22 7H6"/>
                </svg>
            </div>
        </div>
    </div>
}

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [productsLoaded, setProductsLoaded] = useState(false)
    
    // {
    //     id: 0,
    //     name: "Product 1",
    //     image: product_image,
    //     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    //     price: "$0.00"
    // }

    // On initial render, decide whether to fetch all products
    // or search by name
    useEffect(() => {
        const decodedQuery = decodeURIComponent(searchParams.get("search"))

        getProducts()
            .then(async ({ data }) => {
                setProducts(data)
                setProductsLoaded(true)
            })
    }, [])

    

    return <div className="page-wrapper">
        <ContentWrapper>
            <h1 className="text-4xl text-center border-b font-bold">Home Page</h1>
            <SearchBar query={searchParams.get("search")} setQuery={setSearchParams} setProducts={setProducts} />
            <div className="flex flex-col md:grid gap-4 grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {
                    productsLoaded ?
                        products.map((product, index) => {
                            return <ProductListing key={index} item={product}/>
                        }) :
                        Array(8).fill(<PlaceholderListing />)
                }
            </div>
        </ContentWrapper>
        <div className="absolute sm:bottom-4 bottom-24 right-4">
            <CartWidget />
        </div>
    </div>
}

export default Home
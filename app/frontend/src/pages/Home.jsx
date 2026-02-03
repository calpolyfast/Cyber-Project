import { useEffect, useState } from 'react';
import banner_image from '../assets/placeholder.jpg';
import product_image from '../assets/product_placeholder.png';
import { getProducts, searchProduct } from '../api/products.mjs';
import SearchBar from '../components/SearchBar';
import { useSearchParams } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper';

import shoppingCartIcon from '../svg/shoppingcart.svg';

const ProductListing = ({ name, image, description, price }) => {
    return <div className="flex flex-row rounded-sm border-2 border-secondary gap-4 p-2 bg-white">
        <div className="flex flex-col font-sans">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p>{description}</p>
            <div>
                <p className="text-2xl font-bold">{price}</p>
            </div>
        </div>
        <img src={image} style={{height: 200, width: 200}} alt="placeholder"></img>
        <div className="flex items-center justify-center w-full h-full">
            <button className="w-[50%] h-[50%]">
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
            return <ProductListing key={index} name={product.name} image={product.image} description={product.description} price={product.price}/>
        })}</div>
    </ContentWrapper>
}

export default Home
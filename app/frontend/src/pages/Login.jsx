import { useContext, useEffect, useState } from 'react';
import banner_image from '../assets/placeholder.jpg';
import product_image from '../assets/product_placeholder.png';
import { getProducts, searchProduct } from '../api/products.mjs';
import SearchBar from '../components/SearchBar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';

const ProductListing = ({ name, image, description, price }) => {
    return <div className="flex flex-row rounded-sm border-2 border-secondary gap-4 bg-white">
        <div className="flex flex-col font-sans p-2">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p>{description}</p>
            <div>
                <p className="text-2xl font-bold">{price}</p>
            </div>
        </div>
        <img src={image} style={{height: 200, width: 200}} alt="placeholder"></img>
    </div>
}

const Login = () => {
    const { login } = useContext(AuthContext)
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = await login(username, password)

        if (token)
        {
            navigate("/")
        }
    }

    return <div className="page-wrapper">
        <div className="flex flex-col justify-center items-center gap-4 w-full">
            <form 
                className="flex flex-col gap-4 bg-primary-light p-8 relative
                            w-full max-w-2xl rounded-2xl shadow-md overflow-y-auto" 
                onSubmit={handleSubmit}
            >
                <h1 className="text-4xl text-center border-b font-bold">Login</h1>
                <div className="flex flex-col w-full">
                    <label>Username</label>
                    <input type="text" id="username" onChange={(e) => {setUsername(e.target.value)}} className="border rounded-sm p-2"></input>
                </div>
               
                <div className="flex flex-col w-full">
                    <label>Password</label>
                    <input type="password" id="password" onChange={(e) => {setPassword(e.target.value)}} className="border rounded-sm p-2"></input>
                </div>
                <button type="submit" className="bg-bg px-4 py-2 cursor-pointer">Submit</button>
            </form>
            <div>Don't have an account yet? Register <a className="underline" href="/register">here</a></div>
        </div>
    </div>
}

export default Login
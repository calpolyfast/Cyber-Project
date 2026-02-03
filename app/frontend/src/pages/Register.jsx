import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const navigate = useNavigate();

    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await register(username, email, password);
        if (token)
        {
            navigate("/")
        }
    }

    return <div>
        <form className="flex flex-col gap-4 bg-primary-light mt-8 p-4" onSubmit={handleSubmit}>
            <h1 className="text-4xl text-center border-b font-bold">Register</h1>
            <label>Username</label>
            <input type="text" id="username" onChange={(e) => {setUsername(e.target.value)}} className="border rounded-sm"></input>

            <label>Email</label>
            <input type="text" id="email" onChange={(e) => {setEmail(e.target.value)}} className="border rounded-sm"></input>

            <label>Password</label>
            <input type="text" id="password" onChange={(e) => {setPassword(e.target.value)}} className="border rounded-sm"></input>

            <button type="submit">Submit</button>
        </form>
        <div>Already have an account? Log in <a className="underline" href="/login">here</a></div>
    </div>
}

export default Register
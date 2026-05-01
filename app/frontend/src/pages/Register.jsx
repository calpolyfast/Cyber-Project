import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const navigate = useNavigate();

    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await register(username, null, password);
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
                <h1 className="text-4xl text-center border-b font-bold">Register</h1>
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

            <div>Already have an account? Log in <a className="underline" href="/login">here</a></div>
     </div>
    </div>
}

export default Register
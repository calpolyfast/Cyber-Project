import { useState } from "react";

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        // Do something with { username, email, password }
        console.log({ username, email, password });
    }

    return (
        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
                <label htmlFor="username">Username</label>
                <input
                    className="bg-primary text-white p-2 w-full"
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input
                    className="bg-primary text-white p-2"
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <input
                    className="bg-primary text-white p-2"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                />
            </div>

            <button type="submit" className="text-2xl hover:bg-primary">Register</button>

            <div>Already have an account? Log in <a className="underline" href="/login">here</a></div>
        </form>
    );
}

const Register = () => {
    return <div>
        <div className="flex flex-col gap-4 bg-primary-light mt-8 p-4">
            <RegisterForm />
        </div>
    </div>
}

export default Register
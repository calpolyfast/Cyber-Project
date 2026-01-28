import { useState } from "react";

const LoginForm = () => {
    const [username, setUsername] = useState("");
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

            <button type="submit" className="text-2xl hover:bg-primary">Log In</button>

            <div>Don't have an account? Register <a className="underline" href="/register">here</a></div>
        </form>
    );
}

const Login = () => {
    return <div>
        <div className="flex flex-col gap-4 bg-primary-light mt-8 p-4">
            <LoginForm />
        </div>
    </div>
}

export default Login
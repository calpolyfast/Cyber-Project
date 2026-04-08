import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../components/AuthContext"
import { getProfile } from "../api/accounts.mjs"
import LoadingSpinner from "../components/LoadingSpinner"

export default function Account(){

    const { user } = useContext(AuthContext)

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [loadingUserData, setLoadingUserData] = useState(true)

    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    useEffect(() => {
        // If the user is not authenticated, redirect to the login page
        if (!user?.token) {
            window.location.href = "/login"
            return
        }

        const fetchProfile = async () => {
            setLoadingUserData(true)
            try {
                const res = await getProfile()
                const data = res.data
                setUsername(data.username)
                setEmail(data.email)
                setRole(data.role)
            }
            catch (err) {
                console.error("Failed to fetch profile: ", err)
            }
            finally {
                setLoadingUserData(false)
            }
        }

        fetchProfile()
    }, [])

    const updateProfile = async (e) => {
        e.preventDefault()
    }

    const changePassword = async (e) => {
        e.preventDefault()
    }

    if (loadingUserData) {
        return (
            <Wrapper>
                <div className="flex h-full w-full justify-center items-center">
                    <LoadingSpinner />
                </div>
            </Wrapper>
        )
    }

    return (
        <Wrapper>
            <h1 className="text-4xl text-center border-b font-bold">My Account</h1>
            <form className="flex flex-col items-center gap-y-2" onSubmit={updateProfile}>
                <h2 className="text-2xl border-b w-[50%]"> Profile </h2>
                <div className="flex flex-col w-[50%] gap-y-1">
                    <div className="flex flex-col">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" id="username" 
                            name="username" className="border border-primary rounded p-1" 
                            value={username} onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="text" id="email" 
                            name="email" className="border border-primary rounded p-1" 
                            value={email} onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="role">Role</label>
                        <input 
                            type="text" id="role" disabled={true}
                            name="role" className="border border-primary bg-gray-200 cursor-not-allowed rounded p-1" 
                            value={role}
                        />
                    </div>
                </div>
                <div className="flex justify-center w-full">
                    <div className="flex flex-col w-[50%] justify-end gap-y-2">
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded mt-4 cursor-pointer">
                            Update
                        </button>
                    </div>
                </div>
            </form>
            <br />
            <form className="flex flex-col items-center gap-y-1" onSubmit={changePassword}>
                <h2 className="text-2xl border-b w-[50%]"> Change Password </h2>
                <div className="flex flex-col w-[50%] gap-y-2">
                    <div className="flex flex-col">
                        <label htmlFor="oldPassword">Old password</label>
                        <input 
                            type="password" id="oldPassword" 
                            name="oldPassword" className="border border-primary rounded p-1" 
                            value={password} onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="newPassword">New password</label>
                        <input 
                            type="password" id="newPassword" 
                            name="newPassword" className="border border-primary rounded p-1" 
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="confirmNewPassword">Confirm new password</label>
                        <input 
                            type="password" id="confirmNewPassword" 
                            name="confirmNewPassword" className="border border-primary rounded p-1" 
                            value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="flex justify-center w-full">
                    <div className="flex flex-col w-[50%] justify-end gap-y-2">
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded mt-4 cursor-pointer">
                            Change Password
                        </button>
                    </div>
                </div>
            </form>
        </Wrapper>
    )
}

function Wrapper({ children }) {
    return (
        <div className="page-wrapper">
            <div className="flex flex-1 justify-center items-start bg-bg">
                <div className="flex flex-col gap-4 bg-bg p-4 relative w-full ml-auto mr-auto max-w-[75%] rounded-2xl shadow-lg overflow-y-auto">
                    { children }
                </div>
            </div>
        </div>
    )
}
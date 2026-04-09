import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../components/AuthContext"
import { getProfile } from "../api/accounts.mjs"
import LoadingSpinner from "../components/LoadingSpinner"
import { validateUserInfo, validatePassword } from "../util/verifyFields"
import api from "../api/axios.mjs"

export default function Account(){

    const { user, logout } = useContext(AuthContext)

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")

    const [loadingUserData, setLoadingUserData] = useState(false)
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [loadingPasswordChange, setLoadingPasswordChange] = useState(false)

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
                // If the error is a 401, the token is invalid or expired
                // In that case, logout and redirect to the login page
                if (err.response?.status === 401) {
                    alert("Oops! Your current session has expired. Please log in again to continue.")
                    window.location.href = "/login"
                    logout()
                }
                else {
                    alert("Oops! Something went wrong while fetching your profile information. Please try again.")
                }
            }
            finally {
                setLoadingUserData(false)
            }
        }

        fetchProfile()
    }, [])

    const updateProfile = async (e) => {
        e.preventDefault()
        const verifiedResult = validateUserInfo({ username, email })
        if (!verifiedResult.valid) {
            alert(verifiedResult.message)
            return
        }

        setLoadingUpdate(true)

        try {
            const res = await api.put("/accounts/", {
                username, email
            })

            const data = res.data
            setUsername(data.username)
            setEmail(data.email)
            setRole(data.role)

            alert("Profile updated successfully!")
        }
        catch(err) {
            alert("Oops! Something went wrong while updating your profile. Please try again.")
            console.error("Failed to update profile: ", err)
        }
    }

    const changePassword = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmNewPassword) {
            alert("New password and confirm new password do not match. Please try again.")
            return
        }

        const verifiedResult = validatePassword(newPassword)
        if (!verifiedResult.valid) {
            alert(verifiedResult.message)
            return
        }

        setLoadingPasswordChange(true)

        try {
            await api.put("/accounts/change-password", {
                oldPassword: password,
                newPassword
            })

            alert("Password changed successfully!")
            setPassword("")
            setNewPassword("")
            setConfirmNewPassword("")
        }
        catch(err) {
            console.error(err)
            if (err.response?.status === 401) {
                alert("The old password you entered is incorrect. Please try again.")
            }
            else {
                alert("Oops! Something went wrong while changing your password. Please try again.")
            }
            console.error("Failed to change password: ", err)
        }
        finally {
            setLoadingPasswordChange(false)
        }
    }

    if (loadingUserData) {
        return (
            <Wrapper>
                <div className="flex min-h-[70vh] w-full justify-center items-center">
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
                            type="text" id="username" disabled={loadingUpdate}
                            name="username" className="border border-primary rounded p-1" 
                            value={username} onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="text" id="email" disabled={loadingUpdate}
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
                <div className="flex flex-col items-center py-2 gap-y-2 w-full">
                    { loadingUpdate && <LoadingSpinner /> }
                    <div className="flex flex-col w-[50%] justify-end gap-y-2">
                        <button 
                            type="submit" disabled={loadingUpdate}
                            className="bg-primary text-white px-4 py-2 rounded mt-4 cursor-pointer disabled:cursor-not-allowed"
                        >
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
                            type="password" id="oldPassword" disabed={loadingPasswordChange}
                            name="oldPassword" className="border border-primary rounded p-1" 
                            value={password} onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="newPassword">New password</label>
                        <input 
                            type="password" id="newPassword" disabed={loadingPasswordChange}
                            name="newPassword" className="border border-primary rounded p-1" 
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="confirmNewPassword">Confirm new password</label>
                        <input 
                            type="password" id="confirmNewPassword" disabed={loadingPasswordChange}
                            name="confirmNewPassword" className="border border-primary rounded p-1" 
                            value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="flex justify-center w-full">
                    <div className="flex flex-col w-[50%] justify-end gap-y-2">
                        <button 
                            type="submit" disabled={loadingPasswordChange}
                            className="bg-primary text-white px-4 py-2 rounded mt-4 cursor-pointer disabled:cursor-not-allowed"
                        >
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
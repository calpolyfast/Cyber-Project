import { Router } from "express";
import { loginController, logoutController, registerController } from "./users.controllers.js";
import verifyUser from "../middleware/verifyUser.js";

const userRouter = Router()

userRouter.post('/register', registerController)
userRouter.post('/login', loginController)

userRouter.use(verifyUser) // a user can only logout if they're already authenticated
userRouter.post('/logout', logoutController)

export default userRouter
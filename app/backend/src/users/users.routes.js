import { Router } from "express";
import { loginController, registerController } from "./users.controllers.js";

const userRouter = Router()

userRouter.post('/register', registerController)
userRouter.post('/login', loginController)

export default userRouter
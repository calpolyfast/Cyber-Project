import { Router } from "express";
import { registerController } from "./usersDB.controllers.js";

const userRouter = Router()

userRouter.post('/', registerController)

export default userRouter
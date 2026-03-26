import { Router } from "express";
import { createOrderController, getUserOrdersController } from "./orders.controllers.js";
import verifyUser from "../middleware/verifyUser.js";

const OrderRouter = Router()

OrderRouter.use(verifyUser)

OrderRouter.get("/", getUserOrdersController)
OrderRouter.post("/", createOrderController)

export default OrderRouter
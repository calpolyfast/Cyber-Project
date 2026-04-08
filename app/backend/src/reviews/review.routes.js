import { Router } from "express";
import { createReview, getReviews } from "./review.controllers.js";
import verifyUser from "../middleware/verifyUser.js";

const reviewRouter = Router()

reviewRouter.get("/:productId", getReviews)

reviewRouter.use(verifyUser)
reviewRouter.post("/:productId", createReview)

export default reviewRouter
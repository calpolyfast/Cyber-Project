import { Router } from "express";
import 
{ 
    createPerson
} from "./usersDB.controllers.js";

const router = Router()

router.post('/', createPerson)

export default router
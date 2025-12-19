import { Router } from "express";
import 
{ 
    createVulnerability, deleteVulnerability, 
    getAllVulnerabilities, getVulnerabilityById 
} from "./vulnerabilities.controllers.js";
import verifyUser from "../middleware/verifyUser.js";
import verifyOwner from "../middleware/verifyOwner.js";

const router = Router()

router.use(verifyUser)
router.get('/', getAllVulnerabilities)
router.get('/:id', getVulnerabilityById)

router.use(verifyOwner)
router.post('/', createVulnerability)
router.delete('/:id', deleteVulnerability)

export default router
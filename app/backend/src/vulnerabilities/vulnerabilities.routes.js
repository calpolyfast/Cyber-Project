import { Router } from "express";
import 
{ 
    createVulnerability, deleteVulnerability, 
    getAllVulnerabilities, getVulnerabilityById 
} from "./vulnerabilities.controllers.js";
import verifyUser from "../middleware/verifyUser.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = Router()

router.use(verifyUser)
router.get('/', getAllVulnerabilities)
router.get('/:id', getVulnerabilityById)

router.use(verifyAdmin)
router.post('/', createVulnerability)
router.delete('/:id', deleteVulnerability)

export default router
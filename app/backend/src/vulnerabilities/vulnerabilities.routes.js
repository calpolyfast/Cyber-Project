import { Router } from "express";
import 
{ 
    createVulnerability, deleteVulnerability, 
    getAllVulnerabilities, getVulnerabilityById 
} from "./vulnerabilities.controllers.js";
<<<<<<< HEAD

const router = Router()

router.get('/', getAllVulnerabilities)
router.get('/:id', getVulnerabilityById)
=======
import verifyUser from "../middleware/verifyUser.js";
import verifyOwner from "../middleware/verifyOwner.js";

const router = Router()

router.use(verifyUser)
router.get('/', getAllVulnerabilities)
router.get('/:id', getVulnerabilityById)

router.use(verifyOwner)
>>>>>>> b2dd9d5e86cbfd583cdfb72d662000192ff3cbbf
router.post('/', createVulnerability)
router.delete('/:id', deleteVulnerability)

export default router
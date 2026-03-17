import { Router } from "express"
import { getInvoiceByOrderId } from "./invoices.controllers.js"

const InvoiceRouter = Router()

InvoiceRouter.get("/:orderId", getInvoiceByOrderId)

export default InvoiceRouter
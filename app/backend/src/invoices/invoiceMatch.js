import { getInvoiceByOrderId } from "./invoices.controllers"

import { getProfile } from "..accounts/accounts.controllers"


export function InvoiceMatch() {
    const UserInvoice = getInvoiceByOrderId;
    const userID = getProfile.userID;
    return UserInvoice.userID == userID;
}

export function detectVul() {
    if (InvoiceMatch()) {
        
    }
}
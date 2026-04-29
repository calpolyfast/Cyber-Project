import { getInvoiceByOrderId } from "./invoices.controllers"

import { getProfile } from "..accounts/accounts.controllers"
const express = require("express");
const app = express();

export function InvoiceMatch() {
    const UserInvoice = getInvoiceByOrderId;
    const userID = getProfile.userID;
    return UserInvoice.userID === userID;
}

export function getVul() {
    app.get('/api/user/profile', (res) => {
        if (!InvoiceMatch()) {
            return res.status(401).json("unauthorized");
        }
    })
}

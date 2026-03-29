import { CHAMBER_ID } from "../constants";
import api from "./axios.mjs";

export const createChamber = async () => {
    const res = await api.post('/new-chamber')
    if(res.status === 200) {
        const data = res.data
        const chamber_id = data.chamber_id
        localStorage.setItem(CHAMBER_ID, chamber_id)
    }
    return res
}
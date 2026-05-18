import api from "./axios.mjs"

// TODO: Put instance_id into a jwt 
export const sendLinkPayload = (instance_id, payload) => {
    return api.post('/send-link-payload', {
            instance_id: instance_id, 
            payload: payload
        }
    )
}

export const sendHTMLPayload = (payload) => {
    return api.post('/send-html-payload', {
        "payload": payload
    })
}
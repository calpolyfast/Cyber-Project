import api from "./axios.mjs"

// TODO: Put instance_id into a jwt 
export const sendLinkPayload = (instance_id, payload) => {
    console.log(instance_id, payload)
    return api.post('/api/send-link-payload', {
            instance_id: instance_id, 
            payload: payload
        }
    )
}
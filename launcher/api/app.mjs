import express from 'express'
import { spawn } from "child_process";
import cors from "cors";
import options from './cors_options.js';
import { v4 } from 'uuid'

const app = express()
const port = 4000

app.use(cors(options))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/send-link-payload', (req, res) => {
    // For demo purposes. We might want to opt for haivng 'instanceID' be in a JWT that is created when the user deploys a chamber
    const { instance_id, payload } = req.body

    const proc = spawn("bash", ["playwright/runplaywright.sh", instance_id, "gotolink.js", payload])

    proc.stdout.on("data", (data) => {
        if (res.headersSent)
            return
        console.log(data.toString())
        proc.kill()
        return res.status(200).json({ data: data.toString() })
    })

    proc.stderr.on("data", () => {
        if (res.headersSent)
            return
        return res.status(200).json({ data: "No Effect" })
    })

    proc.on("close", () => {
        if (res.headersSent)
            return
        return res.status(200).json({ data: "No Effect" })
    })
})

app.get('/api/chamber/new', (req, res) => {
    const chamberId = v4();
    res.send(chamberId)

    // const proc = spawn("bash", ["../../infra/chambers/deploy.sh", chamberId])

    proc.stdout.on("data", (data) => {
        if (res.headersSent)
            return
        console.log(data.toString())
        proc.kill()
        return res.status(200).json({ data: data.toString() })
    })

    proc.on("close", () => {
        if (!res.headersSent)
            res.status(500)
    })
})

app.listen(port, () => {
  console.log(`Launcher listening on port ${port}`)
})

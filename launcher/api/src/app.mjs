import express from 'express'
import { spawn } from "child_process";
import cors from "cors";
import options from './cors_options.js';
import { v4 } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 4000

app.use(cors(options))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../', 'build')));
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../', 'build', 'index.html'));
});

app.post('/api/send-link-payload', (req, res) => {
    // For demo purposes. We might want to opt for haivng 'instanceID' be in a JWT that is created when the user deploys a chamber
    const { instance_id, payload } = req.body

    const proc = spawn("bash", ["../playwright/runplaywright.sh", instance_id, "gotolink.js", payload])

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

    // TODO: Finish this
    return;
    // const proc = spawn("bash", ["../../infra/chambers/deploy.sh", chamberId])

    proc.stdout.on("data", (data) => {
        if (res.headersSent)
            return
        console.log(data.toString())
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

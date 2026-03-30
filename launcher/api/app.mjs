import express from 'express'
import { spawn } from "child_process";
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
import options from './cors_options.js';
import { randomUUID } from 'crypto';

const app = express()
const port = 4000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors(options))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/new-chamber', (req, res) => {

    // Configure current directory of deploy.sh
    const scriptDir = path.resolve(__dirname, "../../app/infra/chambers");
    const scriptName = "deploy.sh";

    const uuid = randomUUID()
    try {
        const proc = spawn("bash", [scriptName, uuid], {
            cwd: scriptDir
        });

        proc.stderr.on('data', (data) => {
            console.error(`STDERR: ${data}`);
        })

        proc.on("close", () => {
            return res.status(200).json({ id: uuid, message: `Chamber created with id ${uuid}` })
        })
    }
    catch(err){
        console.error(err)
        res.status(500).json({ error: "Something went wrong" })
    }
})

app.post('/api/send-link-payload', (req, res) => {
    // For demo purposes. We might want to opt for haivng 'instanceID' be in a JWT that is created when the user deploys a chamber
    const { instance_id, payload } = req.body

    const proc = spawn("bash", ["playwright/deploy.sh", instance_id, "gotolink.js", payload])

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

app.use(express.static(path.join(__dirname, 'build')));
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Launcher listening on port ${port}`)
})

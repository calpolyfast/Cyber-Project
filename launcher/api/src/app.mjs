import express from 'express'
import { spawn } from "child_process";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
import options from './cors_options.js';
import { randomUUID } from 'crypto';
import cron from 'node-cron'
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000
const BASE_URL = "localhost"

app.use(cors(options))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../', 'build')));
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../', 'build', 'index.html'));
});

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
    // For demo purposes. We might want to opt for having 'instanceID' be in a JWT that is created when the user deploys a chamber
    const { instance_id, payload } = req.body

    const proc = spawn("bash", ["../../scripts/runplaywright.sh", instance_id, "gotolink.js", payload])

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

app.post('/api/send-html-payload', (req, res) => {
    const { instance_id, payload } = req.body

    const proc = spawn("bash", ["../../scripts/runplaywright.sh", instance_id, "htmlpayload.js", payload, BASE_URL])

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

app.get('/api', (req, res) => {
  res.status(200).send("ok");
});

// Every hour, delete all chamber deployments that are older than 1 hour
cron.schedule('0 * * * *', async () => {
    try {
        let output = ''
        const getProc = spawn("kubectl", 
            [
                'get',
                'deployments',
                '--no-headers',
                '-o',
                'custom-columns=NAME:.metadata.name,AGE:.metadata.creationTimestamp'
            ]
        )

        getProc.stdout.on('data', (data) => {
            output += data.toString()
        })

        getProc.stderr.on('data', (data) => {
            console.error(`STDERR: ${data}`)
            rej("ERROR")
        })

        // Wait for the process to finish and handle errors
        await new Promise((res, rej) => {
            getProc.on('close', (code) => {
                    if (code === 0) res()
                    else rej(new Error(errorOutput || `kubectl exited with code ${code}`))
                })
            getProc.on('error', rej)
        })

        const deployments = output.split("\n")
            .map(dep => dep.trim())
            .filter(dep => dep !== "")
            .map(line => {
                const [name, age] = line.split(/\s+/)
                return { name, age: new Date(age) }
            })
            .filter(dep => dep.name.startsWith("chamber-") && new Date() - new Date(dep.age) > 1000)

        // Delete deployments in parallel
        await Promise.all(deployments.map(dep => {
            return new Promise((res, rej) => {
                const delProc = spawn("kubectl", ["delete", "deployment", dep.name]);
                delProc.stdout.on('data', (dep) => console.log(dep.toString()));
                delProc.stderr.on('data', (dep) => console.error(dep.toString()));
                delProc.on('close', (code) => {
                    if (code === 0) res();
                    else rej(new Error(`Failed to delete deployment ${dep.name}`));
                })
                delProc.on('error', rej);
            })
        }))
    }
    catch(err){
        console.error(err)
    }

})

app.use(express.static(path.join(__dirname, 'build')));
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Launcher listening on port ${port}`)
})

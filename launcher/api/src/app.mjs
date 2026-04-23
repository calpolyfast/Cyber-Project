import express from 'express'
import { spawn } from "child_process";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
import options from './cors_options.js';
import { randomUUID } from 'crypto';
import cron from 'node-cron'
import * as dotenv from 'dotenv';
import k8s from '@kubernetes/client-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000
const BASE_URL = "localhost"
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
const NAMESPACE = 'launcher';
const ONE_HOUR_MS = 60 * 60 * 1000;

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
        console.log('Starting cleanup cron job...');

        const response = await k8sApi.listNamespacedDeployment(NAMESPACE);
        const allDeployments = response.body.items;

        const now = new Date();
        const toDelete = allDeployments.filter(dep => {
            const name = dep.metadata.name;
            const created = new Date(dep.metadata.creationTimestamp);
            
            return name.startsWith('chamber-') && (now - created) > ONE_HOUR_MS;
        });

        console.log(`Found ${toDelete.length} stale deployments to delete.`);

        await Promise.all(toDelete.map(async (dep) => {
            const name = dep.metadata.name;
            try {
                await k8sApi.deleteNamespacedDeployment(name, NAMESPACE);
                console.log(`Successfully deleted deployment: ${name}`);
            } catch (err) {
                console.error(`Failed to delete ${name}:`, err.response?.body?.message || err.message);
            }
        }));

    } catch (err) {
        console.error('Error in cron job:', err.response?.body?.message || err.message);
    }
})

app.use(express.static(path.join(__dirname, 'build')));
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    try {
        const res = await k8sApi.listNamespacedDeployment(namespace);
        console.log("Successfully fetched deployments from K8s API");
    } catch (err) {
        // The library returns detailed error bodies from the K8s API
        console.error('Error hitting K8s API:', err.response?.body || err.message);
        throw err;
    }
    console.log(`Launcher listening on port ${port}`)
})

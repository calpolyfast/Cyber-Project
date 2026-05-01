import express from 'express'
import dotenv from 'dotenv'
import { spawn } from "child_process";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
import options from './cors_options.js';
import cron from 'node-cron'
import { randomUUID } from 'crypto';
import cookieParser from 'cookie-parser'
import { addChamberIdToCookie, extractChamberId } from './cookies.js'
import { PassThrough } from 'stream';
import { deleteOldChambers, k8sApi, exec } from './k8smgmt.mjs';

dotenv.config()

const app = express()

// IMPORTANT: When running the chamber deployment with kubernetes,
// the port must be set to 3000 because the chamber.yaml file is configured to forward to port 3000
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(options))
app.use(cookieParser())

app.get('/api/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/new-chamber', (req, res) => {

    // Configure current directory of deploy.sh
    const scriptDir = path.resolve(__dirname, "../infra_copy/scripts")
    const scriptName = "deploy.sh";

    const uuid = randomUUID()

    try {
        const proc = spawn("bash", [scriptName, uuid], {
            cwd: scriptDir
        });

        // Set a time limit for the deployment to avoid hanging
        const timeoutID = setTimeout(() => {
            console.error("Deployment timed out");
            proc.kill();
            if (!res.headersSent) {
                res.status(500).json({ error: "Deployment timed out" });
            }
        }, 10000)

        proc.stderr.on('data', (data) => {
            console.error(`STDERR: ${data}`);
            if (!res.headersSent) {
                res.status(500).json({ error: "Failed to start deployment", details: data.toString() });
            }
        })

        proc.on("close", () => {
            clearTimeout(timeoutID)
            addChamberIdToCookie(res, uuid)
            if (!res.headersSent) {
                return res.status(200).json({ id: uuid, message: `Chamber created with id ${uuid}` })
            }
        })
    }
    catch(err){
        console.error(err)
        if (!res.headersSent) {
            res.status(500).json({ error: "Something went wrong" })
        }
    }
})

// Additional api routes will require a chamberId. The extractChamberId middleware will attach the cookie field to the request object
app.use('/api', extractChamberId)

// This route redirects the client to the url of their chamber (farm store)
app.get('/api/redirect', (req, res) => {
    try {
        const chamberId = req.chamberId
        const base = process.env.BASE_DOMAIN || "localhost:3000";
        const protocol = "http";
        const url = `${protocol}://${chamberId}.${base}`;
        res.redirect(301, url);
    } catch (error) {
        return res.status(500).send("Failed to redirect.");
    } 
});

app.delete('/api/delete-chamber/', async (req, res) => {
    const id = req.chamberId

    if (!chamberId) {
        return res.sendStatus(400);
    }

    if (chamberId.length < 8) {
        return res.sendStatus(400);
    }

    // Verify the id corresponds to an existing deployment
    try {
        const getProc = spawn("kubectl", 
            [
                'get',
                'deployments',
                `chamber-${id}`,
            ]
        )

        let stderr = "";

        getProc.stderr.on("data", (data) => {
            stderr += data.toString();
        })

        // Wait for the process to finish and handle errors
        await new Promise((res, rej) => {
            getProc.on('close', (code) => {
                    if (code === 0) res()
                    else if (stderr.includes("NotFound")) res() // If the deployment is not found, we can consider it already deleted and return success
                    else rej(new Error(`Deployment with id ${id} not found`))
                })
            getProc.on('error', rej)
        })

        if (stderr.includes("NotFound")){
            return res.status(200).json({ message: `Deployment with id ${id} not found. Assuming it's already deleted.` })
        }
    }
    catch(err) {
        console.error(err)
        return res.status(500).json({ error: "Something went wrong trying to find the chamber" })
    }

    // If the deployment exists, delete it
    try {
        const delDeploymentProc = spawn("kubectl", [
            "delete",
            "deployment",
            `chamber-${id}`
        ], {
            stdio: ["ignore", "pipe", "pipe"] // Ignore stdin, pipe stdout and stderr
        })
        const delServicesProc = spawn("kubectl", [
            "delete",
            "services",
            `chamber-${id}`
        ])

        // Log any errors
        delDeploymentProc.stderr.on("data", (data) => {
            console.log(data)
        })
        delServicesProc.stderr.on("data", (data) => {
            console.log(data)
        })

        // Wait for both deletion processes to finish
        await Promise.all([
            new Promise((res, rej) => {
                delDeploymentProc.on('close', (code) => {
                    if (code === 0) res()
                    else rej()
                })

                delDeploymentProc.on('error', rej)
            }), 
            new Promise((res, rej) => {
                let stderr = "";
                delServicesProc.stderr.on("data", (data) => {
                    stderr += data.toString();
                });

                delServicesProc.on('close', (code) => {
                    if (code === 0 || stderr.includes("NotFound")) res()
                    else rej()
                })

                delServicesProc.on('error', rej)
            })
        ])

        return res.status(200).json({ message: `Deployment with id ${id} successfully deleted` })
    }
    catch(err) {
        console.error(err)
        return res.status(500).json({ error: "Something went wrong trying to delete the chamber" })
    }
})

app.post('/api/send-link-payload', async (req, res) => {
    const { instance_id, payload } = req.body

    if (!instance_id || !payload) {
        return res.sendStatus(400);
    }

    if (instance_id.length < 8) {
        return res.sendStatus(400);
    }

    try {
        const podList = await k8sApi.listNamespacedPod({ namespace: "default" });
        const pod = podList.items.find(p => p.metadata.name.startsWith(`chamber-${instance_id}`));

        if (!pod) {
            return res.status(404).send("Pod not found");
        }

        const podName = pod.metadata.name;
        const result = await new Promise((resolve, reject) => {
            const stdoutStream = new PassThrough();
            const chunks = [];

            stdoutStream.on('data', (chunk) => chunks.push(chunk));
            stdoutStream.on('error', reject);

            exec.exec(
                'default',
                podName,
                'browser',
                ['node', 'gotolink.js', `http://localhost:3000/${payload}`],
                stdoutStream, // stdout
                stdoutStream, // stderr (merged for simplicity)
                null,         // stdin
                false,        // tty
                (status) => {
                    const output = Buffer.concat(chunks).toString();
                    console.log('Exec finished with status:', status);
                    resolve(output); 
                }
            ).catch((err) => {
                reject(err);
            });
        });

        return res.status(200).json({ data: result });
        
    } catch (err) {
        console.error("K8s Exec Failure:", err);
        
        if (!res.headersSent) {
            return res.status(500).json({ error: "Failed to execute payload" });
        }
    }
})

app.post('/api/send-html-payload', async (req, res) => {
    const { instance_id, payload } = req.body

    if (!instance_id || !payload) {
        return res.sendStatus(400);
    }
    
    if (instance_id.length < 8) {
        return res.sendStatus(400);
    }

    try {
        const podList = await k8sApi.listNamespacedPod({ namespace: "default" });
        const pod = podList.items.find(p => p.metadata.name.startsWith(`chamber-${instance_id}`));

        if (!pod) {
            return res.status(404).send("Pod not found");
        }

        const podName = pod.metadata.name;
        const result = await new Promise((resolve, reject) => {
            const stdoutStream = new PassThrough();
            const chunks = [];

            stdoutStream.on('data', (chunk) => chunks.push(chunk));
            stdoutStream.on('error', reject);

            exec.exec(
                'default',
                podName,
                'browser',
                ['node', 'htmlpayload.js', payload, 'http://localhost:3000'],
                stdoutStream, // stdout
                stdoutStream, // stderr (merged for simplicity)
                null,         // stdin
                false,        // tty
                (status) => {
                    const output = Buffer.concat(chunks).toString();
                    console.log('Exec finished with status:', status);
                    resolve(output); 
                }
            ).catch((err) => {
                reject(err);
            });
        });

        return res.status(200).json({ data: result });
        
    } catch (err) {
        console.error("K8s Exec Failure:", err);
        
        if (!res.headersSent) {
            return res.status(500).json({ error: "Failed to execute payload" });
        }
    }
})

// Every hour, delete all chamber deployments and services that are older than 1 hour
// Removing for now, will need to manually delete after May 1st workshop.
// cron.schedule('0 * * * *', deleteOldChambers)

app.use(express.static(path.join(__dirname, '../', 'build')));
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Launcher listening on port ${port}`)
})

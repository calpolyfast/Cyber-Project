import * as k8s from '@kubernetes/client-node'

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const currentContext = kc.getCurrentContext();
if (!currentContext) {
    console.error("Error: No Kubernetes configuration found.");
} else {
    console.log("Connected to context:", currentContext);
}

export const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
export const appsK8sApi = kc.makeApiClient(k8s.AppsV1Api);
export const exec = new k8s.Exec(kc);

export const deleteOldChambers = async () => {
    try {
        const res = await appsK8sApi.listNamespacedDeployment({namespace: "default", labelSelector: "app=chamber"});
        const deployments = res.items;

        const now = new Date();
        const oneHourAgo = now.getTime() - (60 * 60 * 1000);

        for (const deployment of deployments) {
            const creationTimestamp = new Date(deployment.metadata.creationTimestamp).getTime();

            if (creationTimestamp < oneHourAgo) {
                console.log(`Deleting deployment: ${deployment.metadata.name}...`);
                
                await appsK8sApi.deleteNamespacedDeployment({namespace: "default", name: deployment.metadata.name});
                console.log(`Successfully deleted ${deployment.metadata.name}`);

                try {
                    await coreK8sApi.deleteNamespacedService({
                        name: deployment.metadata.name, 
                        namespace: "default"
                    });
                    console.log(`Successfully deleted service ${deployment.metadata.name}`);
                } catch (serviceErr) {
                    console.warn(`Service ${deployment.metadata.name} not found or already deleted.`);
                }
            }
        }

        console.log("Old chambers removed")
        return res?.status(200);
    }
    catch(err){
        console.error(err)
        return res?.status(500);
    }
}
## Architecture Overview
The project uses a Kubernetes cluster with Traefik for ingress that routes users to the launcher app as the front-door to the whole project, as well as to each chamber via their unique IDs in the hostname. The chambers are separated deployments with singleton pods, which contain the vulnerable web server, an ephemeral PostgreSQL server for the vulnerable web server, and a Playwright container for simulating a secondary user to facilitate simulating cross-site attacks.

Upon entry to the project, users can initialize their own chamber and are redirected to it via the launcher app. Once this app is created, it will persist until manually removed.

## Setup Instructions

Images created from this project consist of:
- The vulnerable web server for each chamber (Referred to as 'APP_IMAGE' in deploy.sh)
- The Playwright container for simulating cross-site attacks (Referred to as 'PLAYWRIGHT_IMAGE' in deploy.sh)
- The launcher app (Referred to as 'LAUNCHER_APP_IMAGE' in init.sh)

As of now, these images must be present within the local store of the machine running the cluster. All other images are pulled from Docker Hub.

## Building Source Before Building Images

If the images must be created locally, the front-end source files first need to be built and supplied to their backends. This step is necessary to ensure that the containers running the images can serve their front-end files.
- /app
    - /frontend and /backend must have .env files present before building. The .env.example files can be followed for what is required.
    - /frontend can have two separate .env files: `.env.development` for using environment variables, `.env.production` for using environment variables on build. **The variables in `.env.production` are used when building the files.** 
    - `npm run build` will build the files and place them into /app/backend/build
- /launcher
    - /web and /api must have .env files present before building. The .env.example files can be followed for what is required.
    - /web can have two separate .env files: `.env.development` for using environment variables, `.env.production` for using environment variables on build. **The variables in `.env.production` are used when building the files.** 
    - `npm run build` will build the files and place them into /launcher/api/build

Once the frontend files have been built and supplied with their necessary environment variables, the images can be built.

## Building Docker Images

To create the images for the web servers locally, the corresponding Dockerfiles are present in:
- /app/backend/Dockerfile - Builds APP_IMAGE
- /launcher/playwright/Dockerfile - Builds PLAYWRIGHT_IMAGE
- /launcher/api/Dockerfile - Builds LAUNCHER_APP_IMAGE

Simply navigate to these directories containing their Dockerfile, and run the build command for building Docker files (May be `docker build -t <image name> .` or different, depending on environment)

After building the Docker images, the variables within /infra/scripts must be updated to reflect the image names.
- /scripts/deploy.sh - APP_IMAGE
- /scripts/deploy.sh - PLAYWRIGHT_IMAGE
- /scripts/init.sh - LAUNCHER_APP_IMAGE

Once the images have been built, Kubernetes will be able to use them for creating and running deployments.

## Initializing Kubernetes and Creating Chambers

The first step for setting up the app in Kubernetes is to run the `scripts/init.sh` script. This will set up the Traefik ingress and the launcher app as the entrance.
Subsequently, the Traefik service must be port forwarded to a port on the host machine running Kubernetes. To do this, simply run `scripts/port-forward.sh` with the host's port as the first argument
- Optionally, a second argument can be passed to `port-forward.sh` for specifying the internal port. The default value is 80, which Traefik uses for web traffic, but 8080 can be passed for accessing the Traefik dashboard.
Once Traefik is port forwarded, the launcher app can be accessed on the host machine's localhost.

To create chambers, the `scripts/deploy.sh` script is used. The BASE_DOMAIN variable reflects the domain that is used to connect to the host machine, and INSTANCE_ID is the unique ID for that chamber. Running the script multiple times with a different INSTANCE_ID each time will result in multiple ClusterIP services and deployments being created in Kubernetes for those chambers. 

Once a chamber has been created, it can be accessed by adding its INSTANCE_ID to the subdomain prefix of the BASE_DOMAIN. For example: `http://<instance-id>.localhost`.
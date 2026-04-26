export LAUNCHER_APP_IMAGE="launcher-app:latest"

kubectl apply -f ../chambers/traefik.yaml
kubectl apply -f ../chambers/rbac-traefik-endpointslices.yaml
kubectl apply -f ../chambers/rbac.yaml
envsubst < ../chambers/launcher.yaml | kubectl apply -f -
set -a
source ../chambers/.env
set +a

kubectl apply -f ../chambers/traefik.yaml
kubectl apply -f ../chambers/rbac-traefik-endpointslices.yaml
envsubst < ../chambers/launcher.yaml | kubectl apply -f -
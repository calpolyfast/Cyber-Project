set -a
source .env
set +a

export INSTANCE_ID="test-2-id"
export BASE_DOMAIN="localhost"
export APP_IMAGE="backend-app:latest"

envsubst < chamber.yaml | kubectl apply -f -
kubectl apply -f traefik.yaml
kubectl apply -f rbac-traefik-endpointslices.yaml
#kubectl exec -it deploy/chamber-${INSTANCE_ID} -c app -- npx prisma migrate dev
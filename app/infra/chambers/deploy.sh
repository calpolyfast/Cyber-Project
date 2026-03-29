# Example for running this script: deploy.sh <some-id>

INSTANCE_ID=${1:-"test-default"}

set -a
source .env
set +a

export INSTANCE_ID
export BASE_DOMAIN="localhost"

envsubst < chamber.yaml | kubectl apply -f -
kubectl apply -f traefik.yaml
kubectl apply -f rbac-traefik-endpointslices.yaml
#kubectl exec -it deploy/chamber-${INSTANCE_ID} -c app -- npx prisma migrate dev
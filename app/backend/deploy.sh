export INSTANCE_ID="test-id"
export BASE_DOMAIN="localhost"
export APP_IMAGE="backend-app:latest"

echo (envsubst < chamber.yaml.tmpl) # envsubst < chamber.yaml.tmpl | kubectl apply -f -
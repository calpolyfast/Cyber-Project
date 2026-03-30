#!/usr/bin/env bash

set -a
source ../chambers/.env
set +a

export INSTANCE_ID="test-3-id"
export BASE_DOMAIN="localhost"
export APP_IMAGE="backend-app:latest"
export PLAYWRIGHT_IMAGE="playwright-browser:latest"

envsubst < ../chambers/chamber.yaml | kubectl apply -f -
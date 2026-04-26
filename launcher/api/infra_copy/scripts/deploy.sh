#!/usr/bin/env bash

# Example for running this script: deploy.sh <some-id>

INSTANCE_ID=${1:-"test-default"}

set -a
source ../.env
set +a

export INSTANCE_ID
export BASE_DOMAIN="localhost"
export APP_IMAGE="backend-app:latest"
export PLAYWRIGHT_IMAGE="playwright-browser:latest"

envsubst < ../chambers/chamber.yaml | kubectl apply -f -
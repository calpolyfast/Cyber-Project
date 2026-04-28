#!/usr/bin/env bash

# Example for running this script: deploy.sh <some-id>

INSTANCE_ID=${1:-"test-default"}

set -a
source ../.env
set +a

export INSTANCE_ID
export BASE_DOMAIN="172.25.17.1.nip.io"
export APP_IMAGE="jrwoline/chamber-app"
export PLAYWRIGHT_IMAGE="jrwoline/playwright-browser"

envsubst < ../chambers/chamber.yaml | kubectl apply -f -
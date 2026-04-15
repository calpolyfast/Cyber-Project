#!/usr/bin/env bash

set -a
source ../chambers/.env
set +a

export INSTANCE_ID="test-3-id"
export BASE_DOMAIN="localhost"

envsubst < ../chambers/chamber.yaml | kubectl apply -f -
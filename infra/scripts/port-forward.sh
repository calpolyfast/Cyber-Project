#!/usr/bin/env bash

# Usage: bash port-forward.sh <external port> <optional: internal port>
# Port forwards the Traefik service to allow access via localhost on the host machine

if [ -z "$1" ]; then
    echo "Error: Missing external port argument"
    exit 1
fi

kubectl port-forward -n traefik service/traefik "$1":"${2:-80}"
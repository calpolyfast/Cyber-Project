#!/usr/bin/env bash

if [ -z "$1" ]; then
    echo "Error: missing chamber ID"
    exit 1
fi

kubectl get pods -o name | grep "$1" | head -n1 | cut -d/ -f2
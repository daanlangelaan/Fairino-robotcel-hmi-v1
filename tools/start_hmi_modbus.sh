#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")/.."

: "${FAIRINO_HOST:=192.168.58.2}"
: "${FAIRINO_PORT:=502}"
: "${FAIRINO_UNIT_ID:=1}"
: "${PORT:=8787}"
: "${HMI_BIND_HOST:=0.0.0.0}"
: "${HMI_BRIDGE_MODE:=modbus}"

export FAIRINO_HOST
export FAIRINO_PORT
export FAIRINO_UNIT_ID
export PORT
export HMI_BIND_HOST
export HMI_BRIDGE_MODE

exec node tools/start-hmi.mjs

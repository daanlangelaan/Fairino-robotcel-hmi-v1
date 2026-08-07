#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd)
deploy_root=${FAIRINO_DEPLOY_ROOT:-/opt/fairino-robotcel-hmi}
live_api_url=${FAIRINO_LIVE_API_URL:-http://127.0.0.1:8787/api/registers}
backup_root=${FAIRINO_BACKUP_ROOT:-/opt/fairino-hmi-backups}
service_name=${FAIRINO_HMI_SERVICE:-fairino-hmi}

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this deployment with sudo: sudo ./tools/deploy-hmi.sh" >&2
  exit 2
fi

for command_name in curl diff node npm rsync systemctl tar; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Required command is missing: $command_name" >&2
    exit 2
  fi
done

if ! getent passwd fairino >/dev/null 2>&1; then
  echo "Required service account is missing: fairino" >&2
  exit 2
fi

if [ ! -f "$repo_root/hmi/server.mjs" ] || [ ! -f "$repo_root/package.json" ]; then
  echo "Workspace does not contain the expected HMI source files." >&2
  exit 2
fi

echo "Running workspace checks..."
npm --prefix "$repo_root" run check

status_file=$(mktemp)
trap 'rm -f "$status_file"' EXIT HUP INT TERM

if ! curl --fail --silent --show-error --max-time 5 "$live_api_url" >"$status_file"; then
  echo "Deployment refused: the live HMI API is unavailable for the safety check." >&2
  exit 3
fi

controller_host=$(node -e '
  const fs = require("node:fs");
  const snapshot = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  const host = String(snapshot.endpoint || "").split(":")[0];
  if (!host) process.exit(1);
  process.stdout.write(host);
' "$status_file")
rpc_port=${FAIRINO_RPC_PORT:-20003}
program_state=$(node --input-type=module -e '
  const { pathToFileURL } = await import("node:url");
  const moduleUrl = pathToFileURL(process.argv[1]).href;
  const { FairinoRpcClient } = await import(moduleUrl);
  const client = new FairinoRpcClient({
    host: process.argv[2],
    port: Number(process.argv[3]),
    timeout: 3000,
    verifyDelayMs: 0,
  });
  process.stdout.write(String(await client.getProgramState()));
' "$repo_root/hmi/fairino-rpc.mjs" "$controller_host" "$rpc_port")

if [ "$program_state" -ne 1 ]; then
  echo "Deployment refused: controller program state is $program_state, not stopped (1)." >&2
  exit 3
fi

timestamp=$(date +%Y%m%d_%H%M%S)
install -d -m 0755 "$backup_root"
if [ -d "$deploy_root/hmi" ]; then
  echo "Backing up current deployed runtime..."
  tar -C "$deploy_root" -czf "$backup_root/hmi-runtime-$timestamp.tar.gz" \
    hmi tests deploy/systemd package.json package-lock.json tools/start-hmi.mjs \
    tools/start_hmi_modbus.sh tools/start_hmi_modbus.ps1
fi

install -d -m 0755 "$deploy_root/hmi" "$deploy_root/tests" "$deploy_root/tools" "$deploy_root/deploy/systemd"
rsync -a --delete "$repo_root/hmi/" "$deploy_root/hmi/"
rsync -a --delete "$repo_root/tests/" "$deploy_root/tests/"
rsync -a --delete "$repo_root/deploy/systemd/" "$deploy_root/deploy/systemd/"
rsync -a "$repo_root/package.json" "$repo_root/package-lock.json" "$deploy_root/"
rsync -a \
  "$repo_root/tools/start-hmi.mjs" \
  "$repo_root/tools/start_hmi_modbus.sh" \
  "$repo_root/tools/start_hmi_modbus.ps1" \
  "$deploy_root/tools/"

chown -R fairino:fairino \
  "$deploy_root/hmi" \
  "$deploy_root/tests" \
  "$deploy_root/tools" \
  "$deploy_root/deploy" \
  "$deploy_root/package.json" \
  "$deploy_root/package-lock.json"

echo "Restarting $service_name..."
systemctl restart "$service_name"

attempt=0
while [ "$attempt" -lt 15 ]; do
  if curl --fail --silent --show-error --max-time 2 "$live_api_url" >"$status_file"; then
    break
  fi
  attempt=$((attempt + 1))
  sleep 1
done

if [ "$attempt" -ge 15 ]; then
  echo "Deployment completed, but the HMI API did not become ready." >&2
  systemctl status "$service_name" --no-pager --full || true
  exit 4
fi

"$repo_root/tools/check-hmi-sync.sh"
node -e '
  const fs = require("node:fs");
  const snapshot = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  console.log(`Live HMI: mode=${snapshot.mode}, connected=${snapshot.connected}, endpoint=${snapshot.endpoint}`);
' "$status_file"
echo "Deployment completed. Backup: $backup_root/hmi-runtime-$timestamp.tar.gz"

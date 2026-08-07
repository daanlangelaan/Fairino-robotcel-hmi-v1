#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd)
deploy_root=${FAIRINO_DEPLOY_ROOT:-/opt/fairino-robotcel-hmi}
status=0

if [ ! -d "$deploy_root" ]; then
  echo "Deployed HMI directory does not exist: $deploy_root" >&2
  exit 2
fi

compare_directory() {
  relative_path=$1
  if ! diff -qr "$repo_root/$relative_path" "$deploy_root/$relative_path"; then
    status=1
  fi
}

compare_file() {
  relative_path=$1
  if [ ! -f "$deploy_root/$relative_path" ]; then
    echo "Only in workspace: $relative_path"
    status=1
  elif ! cmp -s "$repo_root/$relative_path" "$deploy_root/$relative_path"; then
    echo "Files differ: $relative_path"
    status=1
  fi
}

compare_directory hmi
compare_directory tests
compare_directory deploy/systemd

for relative_path in \
  package.json \
  package-lock.json \
  tools/start-hmi.mjs \
  tools/start_hmi_modbus.sh \
  tools/start_hmi_modbus.ps1
do
  compare_file "$relative_path"
done

if [ "$status" -ne 0 ]; then
  echo "Workspace and deployed HMI differ." >&2
  exit 1
fi

echo "Workspace and deployed HMI runtime files match."

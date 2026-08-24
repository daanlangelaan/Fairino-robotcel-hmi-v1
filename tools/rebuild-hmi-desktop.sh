#!/bin/sh
set -u

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd)
deploy_script="$repo_root/tools/deploy-hmi.sh"
close_hmi=/home/longus/.local/bin/close-fairino-hmi
start_hmi=/home/longus/.local/bin/start-fairino-hmi

notify() {
  /usr/bin/notify-send "Fairino HMI bijwerken" "$1" >/dev/null 2>&1 || true
}

wait_after_failure() {
  printf '\nBijwerken is niet uitgevoerd. Lees de melding hierboven.\n'
  printf 'Druk op Enter om dit venster te sluiten... '
  read -r answer
}

printf '\nFairino HMI veilig bijwerken\n'
printf 'Workspace: %s\n\n' "$repo_root"
printf 'De update gaat alleen door wanneer de tests slagen en het robotprogramma gestopt is.\n'
printf 'Daarna wordt een back-up gemaakt en de HMI-service opnieuw gestart.\n\n'

if [ ! -x "$deploy_script" ]; then
  printf 'FOUT: deployscript ontbreekt of is niet uitvoerbaar: %s\n' "$deploy_script" >&2
  notify "Bijwerken mislukt: deployscript niet beschikbaar."
  wait_after_failure
  exit 1
fi

/usr/bin/sudo "$deploy_script"
status=$?
if [ "$status" -ne 0 ]; then
  notify "Bijwerken afgebroken. Controleer de terminalmelding."
  wait_after_failure
  exit "$status"
fi

printf '\nHMI is bijgewerkt. Het HMI-venster wordt opnieuw geopend...\n'
notify "HMI bijgewerkt; het bedienvenster wordt opnieuw geopend."

if [ -x "$close_hmi" ]; then
  "$close_hmi" >/dev/null 2>&1 || true
fi

if [ -x "$start_hmi" ]; then
  /usr/bin/setsid -f "$start_hmi" >/dev/null 2>&1 || true
else
  printf 'Start HMI handmatig: %s ontbreekt.\n' "$start_hmi" >&2
fi

/usr/bin/sleep 3

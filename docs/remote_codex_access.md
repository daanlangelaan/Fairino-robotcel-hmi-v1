# Remote Codex-toegang tot de MiniPC

Deze handleiding beschrijft de beheerverbinding waarmee Codex op een Windows-
laptop veilig werkt met de lokale bestanden en shell van de robotcel-MiniPC.
De verbinding gebruikt SSH over Tailscale. Er wordt geen SSH- of Codex-poort
op de internetrouter gepubliceerd.

## Overzicht

| Onderdeel | Waarde |
| --- | --- |
| MiniPC-hostnaam | `robotcel-minipc` |
| Tailscale-apparaat | `robotcel-minipc` |
| Tailscale IPv4 | `100.99.163.50` |
| SSH-gebruiker | `longus` |
| SSH-alias op de laptop | `fairino-host` |
| Remote projectmap | `/home/longus/Codex/Fairino-robotcel-hmi-v1` |

De MiniPC en de beheerlaptop moeten bij hetzelfde vertrouwde Tailscale-netwerk
horen. De Tailscale-beheerpagina hoort voor de MiniPC **SSH** als actief te tonen.

## Ingerichte MiniPC-services

De MiniPC heeft OpenSSH op TCP-poort 22, Tailscale SSH, een ingelogde Codex CLI
en automatisch startende services `ssh` en `tailscaled`. Sleep-, suspend-,
hibernate- en hybrid-sleep-targets zijn gemaskeerd zodat de MiniPC bereikbaar
blijft. Gewone OpenSSH is alleen voor gebruiker `longus` en als
public-key-fallback ingericht: wachtwoordlogin, keyboard-interactive login en
rootlogin zijn uitgeschakeld. Tailscale SSH verzorgt de normale remote
beheerlogin.

Controleer de status op de MiniPC met:

```bash
systemctl is-enabled ssh tailscaled
systemctl is-active ssh tailscaled
tailscale status
tailscale ip -4
codex login status
sudo tailscale debug prefs | grep '"RunSSH"'
```

Voor `RunSSH` is de verwachte waarde `true`.

Controleer de OpenSSH-hardening met:

```bash
sudo sshd -T | grep -E '^(passwordauthentication|kbdinteractiveauthentication|permitrootlogin|maxauthtries|logingracetime)'
```

Verwacht onder meer `passwordauthentication no`, `permitrootlogin no` en
`maxauthtries 3`.

## Windows-laptop configureren

Installeer Tailscale, meld aan bij hetzelfde Tailscale-netwerk en test:

```powershell
ssh longus@100.99.163.50
```

Bevestig de host-fingerprint alleen wanneer de verbinding bewust met deze
MiniPC wordt opgezet. Maak daarna `%USERPROFILE%\.ssh\config` aan als bestand
zonder `.txt`-extensie:

```sshconfig
Host fairino-host
    HostName 100.99.163.50
    User longus
```

Test de alias met `ssh fairino-host`.

Voer deze test minimaal een keer uit voordat de MiniPC bij een klant wordt
geplaatst en opnieuw na wijzigingen aan Tailscale access controls. De verbinding
moet zonder Linux-wachtwoordprompt tot stand komen. Een eventuele Tailscale-
herauthenticatie in de browser is wel normaal wanneer de SSH-policy `check`
gebruikt.

## Remote project aan Codex toevoegen

Open op de Windows-laptop:

```text
Settings > Connections > SSH
```

Schakel `fairino-host` in en voeg toe:

```text
/home/longus/Codex/Fairino-robotcel-hmi-v1
```

Geef het project een herkenbare naam, bijvoorbeeld `MiniPC - Fairino robotcel`,
en start nieuwe robotcel-chats vanuit dit remote project. De algemene lijst
**Recent** blijft ook chats van andere projecten en computers tonen.

## Veiligheidsafspraken

- Publiceer poort 22 of een Codex app-server nooit rechtstreeks op internet.
- Beperk de Tailscale-organisatie tot vertrouwde accounts en apparaten.
- Commit nooit privésleutels, wachtwoorden, Tailscale-authkeys of Codex-tokens.
- Verwijder een verloren of afgeschreven laptop direct uit Tailscale.
- Beheer klant-MiniPC's als serverapparaten met een tag en geef alleen de
  supportgroep SSH-toegang als gebruiker `longus`.
- Controleer de Tailscale-sleutelvervaldatum vóór uitlevering; voorkom dat een
  onbemande MiniPC door verlopen credentials onbereikbaar wordt.
- Controleer vóór remote wijzigingen de actieve Git-branch en lokale wijzigingen.
- Remote toegang verandert niets aan de robotveiligheid. I/O- en bewegingstests
  vereisen lokale veiligheidsmaatregelen en fysieke controle van de cel.

## Problemen oplossen

Bij een onbekende hostnaam gebruikt u `HostName 100.99.163.50` en controleert u
dat het Windows-bestand exact `config` heet, niet `config.txt`.

Als Codex de host niet toont, controleer dan eerst `ssh fairino-host`, herstart
de desktopapp en open opnieuw `Settings > Connections > SSH`.

Controleer bij een onbereikbare MiniPC lokaal:

```bash
systemctl status ssh tailscaled
tailscale status
```

## Instellingen terugdraaien

Schakel alleen Tailscale SSH uit met:

```bash
sudo tailscale set --ssh=false
```

Sta slaapstanden weer toe met:

```bash
sudo systemctl unmask sleep.target suspend.target hibernate.target hybrid-sleep.target
```

Hiermee wordt de gewone OpenSSH-service niet verwijderd. Schakel die alleen uit
als er een andere bewezen onderhoudsroute beschikbaar is.

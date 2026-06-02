---
name: fairino-simulator
description: Fairino FR5 WebApp simulator workflow for building, uploading, opening, and running Lua programs from the local fairinoproject workspace. Use when Codex needs to test Fairino Lua, automate the Fairino browser simulator at 192.168.92.128, upload generated .lua builds, clear/reset simulator alarms, switch/run teaching programs, or troubleshoot Fairino program loading/caching.
---

# Fairino Simulator

Use this skill for the local Fairino FR5 simulator WebApp and the `C:\softwarebuilds\fairinoproject` project.

## Core Workflow

1. Build a uniquely named Lua release. Prefer timestamped release files under:
   `C:\softwarebuilds\fairinoproject\fairino\programs\releases`

2. Upload via the backend API instead of the WebApp file picker:

   ```powershell
   curl.exe -s -i -F "files=@C:\softwarebuilds\fairinoproject\fairino\programs\releases\<file>.lua" http://192.168.92.128/action/upload
   ```

   A good response is `HTTP/1.1 200 OK` with body `success`.

3. Verify the file exists:

   ```powershell
   $body = '{"cmd":"get_user_data","data":{"type":"1"}}'
   $r = Invoke-WebRequest -Uri 'http://192.168.92.128/action/get' -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing
   [Text.Encoding]::UTF8.GetString($r.Content)
   ```

4. Open the program through the same backend call the WebApp uses:

   ```powershell
   $name = '<file>.lua'
   $lua = [Text.Encoding]::UTF8.GetString((Invoke-WebRequest -Uri 'http://192.168.92.128/action/get' -Method POST -ContentType 'application/json' -Body ('{"cmd":"get_lua_data","data":{"name":"'+$name+'","type":"1"}}') -UseBasicParsing).Content)
   $payload = @{ cmd='open_lua_file'; data=@{ name=$name; pgvalue=$lua; type='1' } } | ConvertTo-Json -Depth 5
   Invoke-WebRequest -Uri 'http://192.168.92.128/action/act' -Method POST -ContentType 'application/json' -Body $payload -UseBasicParsing
   ```

   A good response is `success`.

5. In the browser, reload the Fairino page if the program name does not update. Clear visible alarms with the blue `Clear` button. Confirm the loaded program name in the header before running.

6. Run from the WebApp:
   - The robot must be enabled. If clicking `Enable` asks to disable the robot, cancel; it is already enabled.
   - `Automatic mode` in the header means it is in automatic mode.
   - Click `Start running`, then confirm `Run`.
   - Watch for red alarm popups and the I/O panel.

## Browser Automation Notes

- Use the Browser plugin / in-app browser for Fairino UI actions.
- Use DOM/CUA node titles where available: `Start running`, `Enable`, `Automatic mode`, `Import`, `Open`.
- The limited browser runtime may not support `setInputFiles`; avoid relying on the file chooser.
- If a modal asks `Confirm to run the current teaching program!`, click `Run`.
- If an alarm says `[Error] Joint command point error, can be reset`, click `Clear`, then load a corrected program.

## Project Commands

Common build commands:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\fairino\source\build_glue_variant.ps1 -Variant glue_offset_test
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\fairino\source\build_glue_variant.ps1 -Variant <variant>
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\fairino\source\build_state_machine_once.ps1
```

Prefer unique release names over overwriting the same filename. The Fairino WebApp can appear to cache or keep stale loaded program contents when the same name is reused.

## Known Fairino/Lua Findings

- The WebApp generated `Lin` offset signature is:
  `Lin(point, speed, radius, choice, type, offset, x, y, z, rx, ry, rz)`
- For simulator-visible glue output, mirror the real glue trigger to a visible DO if needed.
- For wrist/J6 glue rotation, do not rely on `Lin(... offset rz=...)`: it can run without alarm but leave Robot panel `J6` unchanged.
- A proven simulator J6 route is repeated `ServoJ(j1,j2,j3,j4,j5,j6,0,0,0.08,0,0)` commands from a valid current joint pose. The verified home-position test left the Robot panel at `J6: 120`, `RZ: -30`.
- The temporary glue/contact point `P_PLACE` was measured as `J1 21.799, J2 -101.415, J3 126.681, J4 -115.266, J5 -90, J6 21.799`. A ServoJ place test reached `J6: 141.799`, `RZ: -30`, no alarm.
- A full-cycle-with-glue simulator run completed dispenser -> pick -> clamp -> `S100_APPLY_GLUE` -> home, ending at `P_HOME`, `J6: 0`, no alarm.
- Avoid naked numeric `MoveJ` J6 changes unless the joint values and TCP pose are a valid taught pair; mismatches can raise `Joint command point error`.

## Stop Conditions

Stop and report if:

- `/action/upload` does not return `success`.
- The program does not appear in `get_user_data`.
- `open_lua_file` does not return `success`.
- A red Fairino alarm appears after running.
- The robot moves but the intended joint/IO effect is not visible.

param(
    [string]$FairinoHost = "192.168.92.130"
)

$ErrorActionPreference = "Stop"

function Get-AliasConfig {
    $body = '{"cmd":"get_modbusslave_IO_alias_cfg","data":{}}'
    $response = Invoke-WebRequest -Uri "http://$FairinoHost/action/get" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    [Text.Encoding]::UTF8.GetString($response.Content) | ConvertFrom-Json
}

$current = Get-AliasConfig
$di = @($current.DI)
$do = @($current.DO)
$ai = @($current.AI)
$ao = @($current.AO)

$di[0] = "HMI_START_REQ"
$di[1] = "HMI_RESET_REQ"
$di[2] = "HMI_STOP_REQ"
$di[3] = "HMI_AUTO_MODE_REQ"
$di[4] = "HMI_ACK_REQ"
$di[5] = "HMI_ESTOP_REQ"

$ai[0] = "HMI_BATCH_TARGET"
$ai[1] = "HMI_HEARTBEAT"
$ai[2] = "HMI_RECIPE"

$do[0] = "CELL_READY"
$do[1] = "CELL_RUNNING"
$do[2] = "CELL_FAULT_ACTIVE"
$do[3] = "CELL_SAFETY_OK"
$do[4] = "CELL_GLUE_ACTIVE"
$do[5] = "CELL_CLAMP_CLOSED"
$do[6] = "CELL_GRIPPER_OK"
$do[7] = "CELL_BATCH_COMPLETE"
$do[8] = "CELL_COMMS_OK"

$ao[0] = "CELL_STATE"
$ao[1] = "CELL_FAULT_CODE"
$ao[2] = "CELL_CYCLE_COUNT"
$ao[3] = "CELL_BATCH_TARGET_ECHO"
$ao[4] = "CELL_BATCH_DONE"
$ao[5] = "CELL_ROBOT_HEARTBEAT"

$payload = @{
    cmd = "set_modbusslave_IO_alias_cfg"
    data = @{
        DI = $di
        DO = $do
        AI = $ai
        AO = $ao
    }
} | ConvertTo-Json -Depth 5 -Compress

$response = Invoke-WebRequest -Uri "http://$FairinoHost/action/act" -Method POST -ContentType "application/json" -Body $payload -UseBasicParsing
$result = [Text.Encoding]::UTF8.GetString($response.Content)
if ($result -ne "success") {
    throw "Fairino rejected alias restore: $result"
}

$verify = Get-AliasConfig
Write-Host "Restored Fairino HMI Modbus aliases on $FairinoHost"
Write-Host ("DI0-5:  " + (($verify.DI | Select-Object -First 6) -join ", "))
Write-Host ("AI0-2:  " + (($verify.AI | Select-Object -First 3) -join ", "))
Write-Host ("DO0-8:  " + (($verify.DO | Select-Object -First 9) -join ", "))
Write-Host ("AO0-5:  " + (($verify.AO | Select-Object -First 6) -join ", "))

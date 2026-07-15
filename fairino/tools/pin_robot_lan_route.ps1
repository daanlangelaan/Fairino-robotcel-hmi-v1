param(
    [string]$RobotIp = "192.168.58.2",
    [string]$InterfaceAlias = "Ethernet 3"
)

$ErrorActionPreference = "Stop"

$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw "Run this script from an elevated PowerShell window (Run as administrator)."
}

$adapter = Get-NetAdapter -Name $InterfaceAlias -ErrorAction Stop
if ($adapter.Status -ne "Up") {
    throw "$InterfaceAlias is $($adapter.Status). Check the USB-RJ45 adapter, cable, and robot power before pinning the route."
}

$ipConfig = Get-NetIPConfiguration -InterfaceAlias $InterfaceAlias
$sourceIp = @($ipConfig.IPv4Address | Where-Object { $_.IPAddress -like "192.168.58.*" } | Select-Object -First 1)
if (-not $sourceIp) {
    throw "$InterfaceAlias has no 192.168.58.x IPv4 address. Set it to 192.168.58.10/24 first."
}

$prefix = "$RobotIp/32"
Get-NetRoute -AddressFamily IPv4 -DestinationPrefix $prefix -ErrorAction SilentlyContinue |
    Remove-NetRoute -Confirm:$false

New-NetRoute `
    -DestinationPrefix $prefix `
    -InterfaceIndex $adapter.ifIndex `
    -NextHop "0.0.0.0" `
    -RouteMetric 1 `
    -PolicyStore PersistentStore | Out-Null

New-NetRoute `
    -DestinationPrefix $prefix `
    -InterfaceIndex $adapter.ifIndex `
    -NextHop "0.0.0.0" `
    -RouteMetric 1 `
    -PolicyStore ActiveStore `
    -ErrorAction SilentlyContinue | Out-Null

Set-NetIPInterface -InterfaceAlias $InterfaceAlias -AddressFamily IPv4 -AutomaticMetric Disabled -InterfaceMetric 5

Write-Host "Pinned $RobotIp to $InterfaceAlias ($($adapter.InterfaceDescription)), source $($sourceIp.IPAddress)"
Get-NetRoute -AddressFamily IPv4 -DestinationPrefix $prefix |
    Format-Table DestinationPrefix,NextHop,InterfaceAlias,RouteMetric,InterfaceMetric -AutoSize

Test-NetConnection $RobotIp -Port 80 -InformationLevel Detailed

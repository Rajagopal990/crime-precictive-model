param()

$hostsPath = "$env:WINDIR\System32\drivers\etc\hosts"
$entries = @(
  "127.0.0.1 rajafrondend",
  "127.0.0.1 www.rajafrondend"
)

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
  Write-Host "Please run this command in an Administrator terminal: npm run domain:setup" -ForegroundColor Yellow
  exit 1
}

if (-not (Test-Path -LiteralPath $hostsPath)) {
  Write-Error "Hosts file not found: $hostsPath"
  exit 1
}

$content = Get-Content -LiteralPath $hostsPath -ErrorAction Stop
$added = $false

foreach ($line in $entries) {
  if (-not ($content -contains $line)) {
    Add-Content -LiteralPath $hostsPath -Value $line
    $added = $true
  }
}

if ($added) {
  Write-Host "Added rajafrondend host entries to $hostsPath" -ForegroundColor Green
} else {
  Write-Host "Host entries already exist in $hostsPath" -ForegroundColor Cyan
}

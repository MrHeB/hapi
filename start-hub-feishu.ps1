# HAPI Hub with Feishu Integration
# Run this script to start HAPI Hub with Feishu bot enabled

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "HAPI Hub with Feishu Integration" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Set Feishu credentials
$env:FEISHU_APP_ID = "cli_a933a4feadb81cc9"
$env:FEISHU_APP_SECRET = "e7ScIG1itQdnQPPT4KFsZfsWxrKSXhAT"
$env:FEISHU_VERIFICATION_TOKEN = "4bcHA2FSS93WLDsKrOmKDgZ3RrV26oS0"
$env:FEISHU_ENABLED = "true"
$env:FEISHU_NOTIFICATION = "true"
$env:FEISHU_BASE_URL = "https://open.feishu.cn"

Write-Host "Configuration:" -ForegroundColor Green
Write-Host "  App ID: $($env:FEISHU_APP_ID.Substring(0,10))..." -ForegroundColor Gray
Write-Host "  Enabled: $($env:FEISHU_ENABLED)" -ForegroundColor Gray
Write-Host ""

# Add bun to PATH
$bunPath = "$env:USERPROFILE\.bun\bin"
$env:PATH = "$bunPath;$env:PATH"

# Check bun
try {
    $bunVersion = bun --version 2>$null
    Write-Host "Bun version: $bunVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Bun not found at $bunPath" -ForegroundColor Red
    Write-Host "Please install Bun first: https://bun.sh" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting HAPI Hub..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Change to hub directory and run
$hubPath = Join-Path $PSScriptRoot "hub"
Set-Location $hubPath
bun run start

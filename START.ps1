# Wild Guard 5.0 - Main Startup Script
# This script starts all services with correct ports

Write-Host "`n🦁 Wild Guard 5.0 - Wildlife Conservation Platform" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Call the organized startup script
& ".\startup_scripts\START_ALL_SERVICES.ps1"

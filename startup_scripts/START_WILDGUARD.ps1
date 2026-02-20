#!/usr/bin/env pwsh
# Wild Guard 5.0 - Complete Service Launcher
# Starts all services: Backend, Frontend, TensorFlow AI, and YOLO Poaching Detection

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "         WILD GUARD 5.0 - STARTING ALL SERVICES                " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "d:\Wild-Guard 5.0\WildRescueGuide"
Set-Location $projectRoot

# Step 1: Clean up existing processes
Write-Host "[1/5] Cleaning up existing processes..." -ForegroundColor Yellow
Get-Job | Remove-Job -Force -ErrorAction SilentlyContinue
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process python -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*Wild-Guard*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
Write-Host "SUCCESS: Cleanup complete`n" -ForegroundColor Green

# Step 2: Start Backend Server (Port 5000)
Write-Host "[2/5] Starting Backend Express Server (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; Write-Host 'Backend Server (Port 5000)' -ForegroundColor Green; npm run dev"
Start-Sleep -Seconds 8
Write-Host "SUCCESS: Backend server started`n" -ForegroundColor Green

# Step 3: Start Frontend Vite (Port 5173)
Write-Host "[3/5] Starting Frontend Vite Dev Server (Port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\client'; Write-Host 'Frontend Vite (Port 5173)' -ForegroundColor Green; npm run dev"
Start-Sleep -Seconds 8
Write-Host "SUCCESS: Frontend server started`n" -ForegroundColor Green

# Step 4: Start TensorFlow AI Service (Port 5001)
Write-Host "[4/5] Starting TensorFlow AI Service (Port 5001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\ai_models'; Write-Host 'TensorFlow AI Service (Port 5001)' -ForegroundColor Green; python tensorflow_service_simple.py"
Start-Sleep -Seconds 10
Write-Host "SUCCESS: TensorFlow AI service started`n" -ForegroundColor Green

# Step 5: Start YOLO Poaching Detection (Port 5002)
Write-Host "[5/5] Starting YOLO Poaching Detection (Port 5002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\Poaching_Detection'; Write-Host 'YOLO Poaching Detection (Port 5002)' -ForegroundColor Green; python yolo_poaching_service.py"
Start-Sleep -Seconds 10
Write-Host "SUCCESS: YOLO poaching detection started`n" -ForegroundColor Green

# Step 6: Wait for all services to initialize
Write-Host "Waiting for all services to fully initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Step 7: Health Check
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                    SERVICE HEALTH CHECK                        " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$services = @{
    5000 = "Backend Server"
    5173 = "Frontend (Vite)"
    5001 = "TensorFlow AI"
    5002 = "YOLO Poaching"
}

$allOnline = $true

foreach ($port in $services.Keys | Sort-Object) {
    $name = $services[$port]
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:$port" -Method GET -TimeoutSec 3 -ErrorAction Stop
        Write-Host "  [OK] $name (Port ${port}): " -NoNewline -ForegroundColor Green
        Write-Host "ONLINE" -ForegroundColor White -BackgroundColor Green
    } catch {
        Write-Host "  [X] $name (Port ${port}): " -NoNewline -ForegroundColor Red
        Write-Host "OFFLINE" -ForegroundColor White -BackgroundColor Red
        $allOnline = $false
    }
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan

if ($allOnline) {
    Write-Host "              ALL SERVICES RUNNING SUCCESSFULLY!                " -ForegroundColor Green
} else {
    Write-Host "              SOME SERVICES FAILED TO START                     " -ForegroundColor Yellow
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Application URL: " -NoNewline -ForegroundColor Cyan
Write-Host "http://localhost:5173" -ForegroundColor White -BackgroundColor Blue
Write-Host ""
Write-Host "Available Features:" -ForegroundColor Yellow
Write-Host "   * Animal Identification   - AI-powered species recognition" -ForegroundColor Gray
Write-Host "   * Health Assessment        - Animal health analysis" -ForegroundColor Gray
Write-Host "   * Poaching Detection       - Real-time threat detection" -ForegroundColor Gray
Write-Host "   * Flora Identification     - Plant species recognition" -ForegroundColor Gray
Write-Host "   * Sightings Heatmap        - Wildlife tracking maps" -ForegroundColor Gray
Write-Host "   * Habitat Monitoring       - Environmental analysis" -ForegroundColor Gray
Write-Host ""
Write-Host "Service Terminals:" -ForegroundColor Yellow
Write-Host "   Each service is running in its own PowerShell window" -ForegroundColor Gray
Write-Host "   You can monitor logs in real-time" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to open the application in your browser..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Wild Guard 5.0 is now running!" -ForegroundColor Green
Write-Host ""

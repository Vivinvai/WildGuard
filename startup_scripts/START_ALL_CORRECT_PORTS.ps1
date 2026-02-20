#!/usr/bin/env pwsh
# Wild Guard 5.0 - Start All Services with Correct Port Configuration
# Frontend: 5000 | Backend: 5001 | Poaching: 5003 | TensorFlow: 5004 | Health: 5005

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "         WILD GUARD 5.0 - STARTING ALL SERVICES                " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "d:\Wild-Guard 5.0\WildRescueGuide"
Set-Location $projectRoot

# Step 1: Clean up existing processes
Write-Host "[1/6] Cleaning up existing processes..." -ForegroundColor Yellow
Get-Job | Remove-Job -Force -ErrorAction SilentlyContinue
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process python -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*Wild-Guard*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
Write-Host "SUCCESS: Cleanup complete`n" -ForegroundColor Green

# Step 2: Start Frontend Vite on Port 5000
Write-Host "[2/6] Starting Frontend Vite Server (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; Write-Host 'FRONTEND - Port 5000' -ForegroundColor Green; npm run dev"
Start-Sleep -Seconds 8
Write-Host "SUCCESS: Frontend server started`n" -ForegroundColor Green

# Step 3: Start Backend Express on Port 5001
Write-Host "[3/6] Starting Backend Express Server (Port 5001)..." -ForegroundColor Cyan
$env:PORT = "5001"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PORT='5001'; cd '$projectRoot'; Write-Host 'BACKEND - Port 5001' -ForegroundColor Green; npm run dev"
Start-Sleep -Seconds 8
Write-Host "SUCCESS: Backend server started`n" -ForegroundColor Green

# Step 4: Start YOLO Poaching Detection on Port 5003
Write-Host "[4/6] Starting YOLO Poaching Detection (Port 5003)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\Poaching_Detection'; Write-Host 'POACHING DETECTION - Port 5003' -ForegroundColor Green; python yolo_poaching_service.py"
Start-Sleep -Seconds 10
Write-Host "SUCCESS: Poaching detection started`n" -ForegroundColor Green

# Step 5: Start TensorFlow AI Service on Port 5004
Write-Host "[5/6] Starting TensorFlow AI Service (Port 5004)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\ai_models'; Write-Host 'TENSORFLOW AI - Port 5004' -ForegroundColor Green; python tensorflow_service_simple.py"
Start-Sleep -Seconds 10
Write-Host "SUCCESS: TensorFlow AI service started`n" -ForegroundColor Green

# Step 6: Start Health Assessment Service on Port 5005
Write-Host "[6/6] Starting Health Assessment Service (Port 5005)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; Write-Host 'HEALTH ASSESSMENT - Port 5005' -ForegroundColor Green; python injury-detection-service.py"
Start-Sleep -Seconds 10
Write-Host "SUCCESS: Health assessment service started`n" -ForegroundColor Green

# Wait for all services to initialize
Write-Host "Waiting for all services to fully initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Health Check
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                    SERVICE HEALTH CHECK                        " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$services = @{
    5000 = "Frontend (Vite)"
    5001 = "Backend Express"
    5003 = "YOLO Poaching"
    5004 = "TensorFlow AI"
    5005 = "Health Assessment"
}

$allOnline = $true

foreach ($port in $services.Keys | Sort-Object) {
    $name = $services[$port]
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:$port" -UseBasicParsing -Method GET -TimeoutSec 3 -ErrorAction Stop
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
Write-Host "http://localhost:5000" -ForegroundColor White -BackgroundColor Blue
Write-Host ""
Write-Host "Port Configuration:" -ForegroundColor Yellow
Write-Host "   Port 5000 - Frontend (Vite React App)" -ForegroundColor Gray
Write-Host "   Port 5001 - Backend (Express + API)" -ForegroundColor Gray
Write-Host "   Port 5003 - Poaching Detection (YOLO)" -ForegroundColor Gray
Write-Host "   Port 5004 - TensorFlow AI (Animal ID)" -ForegroundColor Gray
Write-Host "   Port 5005 - Health Assessment (Injury)" -ForegroundColor Gray
Write-Host ""
Write-Host "Available Features:" -ForegroundColor Yellow
Write-Host "   * Animal Identification   - AI-powered species recognition" -ForegroundColor Gray
Write-Host "   * Health Assessment        - Animal injury detection" -ForegroundColor Gray
Write-Host "   * Poaching Detection       - Real-time threat analysis" -ForegroundColor Gray
Write-Host "   * Flora Identification     - Plant species recognition" -ForegroundColor Gray
Write-Host "   * Wildlife Tracking        - Sightings and habitat data" -ForegroundColor Gray
Write-Host ""
Write-Host "Service Terminals:" -ForegroundColor Yellow
Write-Host "   Each service is running in its own PowerShell window" -ForegroundColor Gray
Write-Host "   You can monitor logs in real-time" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to open the application in your browser..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:5000"

Write-Host ""
Write-Host "Wild Guard 5.0 is now running!" -ForegroundColor Green
Write-Host ""

# Wild Guard 4.0 - Start All Services
# This script launches all three required services for the application

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          WILD GUARD 4.0 - SERVICE LAUNCHER                   ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "📍 Working Directory: $scriptPath" -ForegroundColor Yellow
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Check for port conflicts
Write-Host "🔍 Checking for port conflicts..." -ForegroundColor Yellow
$ports = @(5000, 5001, 5002)
$conflicts = @()

foreach ($port in $ports) {
    if (Test-Port -Port $port) {
        $conflicts += $port
    }
}

if ($conflicts.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  WARNING: The following ports are already in use:" -ForegroundColor Red
    foreach ($port in $conflicts) {
        Write-Host "   - Port $port" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please close the applications using these ports and try again." -ForegroundColor Yellow
    Write-Host "Or press Ctrl+C to cancel and manually stop the services." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to continue anyway (may cause conflicts)"
}

Write-Host ""
Write-Host "🚀 Starting Wild Guard 4.0 Services..." -ForegroundColor Green
Write-Host ""

# Service 1: YOLOv11 Poaching Detection
Write-Host "1️⃣  Starting YOLOv11 Poaching Detection Service (Port 5002)..." -ForegroundColor Cyan
Start-Job -Name "YOLOv11-Service" -ScriptBlock {
    Set-Location "d:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide\Poaching_Detection"
    python yolo_poaching_service.py
} | Out-Null
Start-Sleep -Seconds 3

# Service 2: TensorFlow AI Service
Write-Host "2️⃣  Starting TensorFlow AI Service (Port 5001)..." -ForegroundColor Cyan
Start-Job -Name "TensorFlow-Service" -ScriptBlock {
    Set-Location "d:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide\ai_models"
    python tensorflow_service.py
} | Out-Null
Start-Sleep -Seconds 5

# Service 3: Node.js Backend + Vite Frontend
Write-Host "3️⃣  Starting Node.js Backend + Frontend (Port 5000)..." -ForegroundColor Cyan
Start-Job -Name "NodeJS-Service" -ScriptBlock {
    Set-Location "d:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"
    npm run dev
} | Out-Null
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "⏳ Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Check service health
Write-Host ""
Write-Host "🏥 Checking Service Health..." -ForegroundColor Cyan
Write-Host ""

$allHealthy = $true

# Check YOLOv11
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5002/health" -UseBasicParsing -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ YOLOv11 Poaching (Port 5002): RUNNING" -ForegroundColor Green
    Write-Host "   📊 $($data.weapon_classes) weapon classes, $($data.animal_classes) animal classes" -ForegroundColor Gray
} catch {
    Write-Host "❌ YOLOv11 Poaching (Port 5002): FAILED" -ForegroundColor Red
    $allHealthy = $false
}

# Check TensorFlow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ TensorFlow AI (Port 5001): RUNNING" -ForegroundColor Green
} catch {
    Write-Host "❌ TensorFlow AI (Port 5001): FAILED" -ForegroundColor Red
    $allHealthy = $false
}

# Check Node.js
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Node.js Backend (Port 5000): RUNNING" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js Backend (Port 5000): FAILED" -ForegroundColor Red
    $allHealthy = $false
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

if ($allHealthy) {
    Write-Host ""
    Write-Host "🎉 All services are running successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Application URL: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "🔫 Poaching Detection: http://localhost:5000/features/poaching-detection" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Background Jobs:" -ForegroundColor Yellow
    Get-Job | Format-Table -AutoSize
    Write-Host ""
    Write-Host "🛑 To stop all services, run: Get-Job | Stop-Job; Get-Job | Remove-Job" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "⚠️  Some services failed to start. Check the job output:" -ForegroundColor Red
    Write-Host ""
    Write-Host "View job output with: Receive-Job -Name <JobName> -Keep" -ForegroundColor Yellow
    Write-Host "Example: Receive-Job -Name YOLOv11-Service -Keep" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📋 Job Status:" -ForegroundColor Yellow
    Get-Job | Format-Table -AutoSize
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

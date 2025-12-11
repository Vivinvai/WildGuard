# Wild Guard 4.0 - Service Launcher
Write-Host "Starting Wild Guard 4.0 Services..." -ForegroundColor Green

$root = "D:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"

Write-Host "1. TensorFlow AI (Port 5001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\ai_models'; python tensorflow_service.py"
Start-Sleep -Seconds 8

Write-Host "2. YOLOv11 Poaching (Port 5002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\Poaching_Detection'; python yolo_poaching_service.py"
Start-Sleep -Seconds 5

Write-Host "3. Node.js + Frontend (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; npm run dev"
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "✅ All services started in separate windows!" -ForegroundColor Green
Write-Host "🌐 Application: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""

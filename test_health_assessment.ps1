# Test Health Assessment with Gemini API
Write-Host "🏥 Testing Wildlife Health Assessment Feature" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$testImage = "d:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide\attached_assets\stock_images\bengal_tiger_wildlif_f41ab7a4.jpg"

if (Test-Path $testImage) {
    Write-Host "✅ Test image found: Bengal Tiger" -ForegroundColor Green
    Write-Host "📤 Uploading to health assessment endpoint..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/identify/health-assessment" `
            -Method POST `
            -Form @{
                image = Get-Item -Path $testImage
            } `
            -ErrorAction Stop
        
        Write-Host "✅ Health Assessment Complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Results:" -ForegroundColor Cyan
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
        
        if ($response.healthStatus) {
            Write-Host "Health Status: " -NoNewline -ForegroundColor White
            Write-Host $response.healthStatus -ForegroundColor $(
                switch ($response.healthStatus) {
                    "HEALTHY" { "Green" }
                    "MINOR_CONCERNS" { "Yellow" }
                    "MAJOR_CONCERNS" { "DarkYellow" }
                    "CRITICAL" { "Red" }
                    default { "White" }
                }
            )
        }
        
        if ($response.severity) {
            Write-Host "Severity: $($response.severity)" -ForegroundColor White
        }
        
        if ($response.diagnosis) {
            Write-Host ""
            Write-Host "Diagnosis:" -ForegroundColor Cyan
            Write-Host $response.diagnosis -ForegroundColor Gray
        }
        
        if ($response.recommendations -and $response.recommendations.Count -gt 0) {
            Write-Host ""
            Write-Host "Recommendations:" -ForegroundColor Cyan
            foreach ($rec in $response.recommendations) {
                Write-Host "  • $rec" -ForegroundColor Gray
            }
        }
        
        if ($response.detailedAnalysis) {
            Write-Host ""
            Write-Host "Detailed Analysis:" -ForegroundColor Cyan
            Write-Host $response.detailedAnalysis -ForegroundColor Gray
        }
        
        if ($response.provider) {
            Write-Host ""
            Write-Host "AI Provider: $($response.provider)" -ForegroundColor DarkCyan
        }
        
        Write-Host ""
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    }
    catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor DarkRed
    }
    
} else {
    Write-Host "❌ Test image not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "💡 Tip: You can also test with your own images!" -ForegroundColor Yellow
Write-Host "   Just upload any animal photo through the website." -ForegroundColor Yellow

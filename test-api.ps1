# OpCa API Test Script

Write-Host "OpCa API Test Basliyor..." -ForegroundColor Green
Write-Host ""

# Adim 1: Login
Write-Host "Adim 1: Admin kullanicisi ile login yapiliyor..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5002/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@example.com","password":"password"}'
    
    if ($loginResponse.success) {
        $token = $loginResponse.data.token
        Write-Host "Login basarili!" -ForegroundColor Green
        Write-Host "Token alindi: $($token.Substring(0,50))..." -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "Login basarisiz!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Login hatasi: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Adim 2: Analysis History
Write-Host "Adim 2: Analiz gecmisi getiriliyor..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $historyResponse = Invoke-RestMethod -Uri "http://localhost:5002/api/analysis/history" -Method GET -Headers $headers
    
    if ($historyResponse.success) {
        Write-Host "Analiz gecmisi basariyla alindi!" -ForegroundColor Green
        Write-Host "Toplam analiz sayisi: $($historyResponse.pagination.totalCount)" -ForegroundColor Cyan
        Write-Host "Mevcut sayfada: $($historyResponse.analyses.Count) analiz" -ForegroundColor Cyan
        Write-Host ""
        
        if ($historyResponse.analyses.Count -gt 0) {
            Write-Host "Ilk analiz detaylari:" -ForegroundColor Magenta
            $firstAnalysis = $historyResponse.analyses[0]
            Write-Host "   - ID: $($firstAnalysis._id)" -ForegroundColor White
            Write-Host "   - Tip: $($firstAnalysis.analysisType)" -ForegroundColor White
            Write-Host "   - Tarih: $($firstAnalysis.createdAt)" -ForegroundColor White
        } else {
            Write-Host "Henuz analiz kaydi bulunmuyor." -ForegroundColor Blue
        }
    } else {
        Write-Host "Analiz gecmisi alinamadi!" -ForegroundColor Red
    }
} catch {
    Write-Host "Analiz gecmisi hatasi: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Hata detayi: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test tamamlandi!" -ForegroundColor Green 
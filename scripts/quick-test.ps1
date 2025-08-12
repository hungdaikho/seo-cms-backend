$response = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" -Method POST -Body '{"email":"admin@gmail.com","password":"Admin1234"}' -ContentType "application/json"
Write-Host "JWT Token: $($response.access_token)"

$headers = @{ "Authorization" = "Bearer $($response.access_token)" }
$stats = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/admin/dashboard/stats" -Method GET -Headers $headers
Write-Host "Total Users: $($stats.totalUsers)"
Write-Host "Active Users: $($stats.activeUsers)"

# PowerShell script to start the development server with automatic port selection
param(
    [int[]]$PortList = @(3000, 3001, 3002, 3003, 3004)
)

Write-Host "🔍 Finding available port..." -ForegroundColor Yellow

function Test-PortAvailable {
    param([int]$Port)
    
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.Connect("localhost", $Port)
        $tcpClient.Close()
        return $false  # Port is in use
    }
    catch {
        return $true   # Port is available
    }
}

$availablePort = $null

foreach ($port in $PortList) {
    if (Test-PortAvailable -Port $port) {
        $availablePort = $port
        break
    }
}

if ($null -eq $availablePort) {
    # Try to find any available port starting from 3005
    for ($port = 3005; $port -lt 4000; $port++) {
        if (Test-PortAvailable -Port $port) {
            $availablePort = $port
            break
        }
    }
}

if ($null -eq $availablePort) {
    Write-Host "❌ No available ports found!" -ForegroundColor Red
    exit 1
}

Write-Host "🎯 Found available port: $availablePort" -ForegroundColor Green

# Update .env.local file
$envPath = ".env.local"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    $envContent = $envContent -replace 'NEXTAUTH_URL=.*', "NEXTAUTH_URL=http://localhost:$availablePort"
    Set-Content $envPath $envContent
    Write-Host "✅ Updated NEXTAUTH_URL to http://localhost:$availablePort" -ForegroundColor Green
}

Write-Host "🚀 Starting Next.js development server on port $availablePort..." -ForegroundColor Cyan

# Start the development server
try {
    & npm run dev -- -p $availablePort
}
catch {
    Write-Host "❌ Error starting development server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
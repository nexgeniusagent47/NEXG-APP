# scripts/setup-postgres.ps1
# NEXG Concierge v1 - idempotent local PostgreSQL provisioning.
#
# Creates an ISOLATED Postgres container for this workspace. It deliberately does
# NOT touch the unrelated `nexg` compose project that owns containers named
# nexg-postgres-1 / nexg-api-1 / nexg-kernel-1 (that stack lives in
# C:\Users\limta\Desktop\NEXG POS and is a separate Go platform).
#
# Credentials match .github/workflows/ci.yml exactly so local == CI.
#
# Usage:  pwsh -File scripts/setup-postgres.ps1
#         pwsh -File scripts/setup-postgres.ps1 -Recreate

[CmdletBinding()]
param(
    [switch]$Recreate,
    [int]$Port = 5433
)

$ErrorActionPreference = 'Stop'

$ContainerName = 'nexg-concierge-pg'
$Image         = 'postgres:15-alpine'
$DbName        = 'nexg_db'
$DbUser        = 'nexg_user'
$DbPassword    = 'nexg_password'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$SchemaPath = Join-Path $RepoRoot 'src/db/schema.sql'
$SeedPath   = Join-Path $RepoRoot 'src/db/seed_excel.sql'

function Write-Step($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "  [ok] $msg" -ForegroundColor Green }
function Write-Warn2($msg){ Write-Host "  [warn] $msg" -ForegroundColor Yellow }

# NOTE: parameter is named $DockerArgs, not $Args. `$Args` is a reserved
# automatic variable in PowerShell and shadowing it breaks native argument
# forwarding (`ValueFromRemainingArguments` then binds tokens like `--format`
# as if they were parameter names).
#
# stderr is relaxed to Continue for the duration of the call. docker writes
# ordinary progress and psql writes NOTICE lines to stderr, and under the
# script-level `Stop` preference PowerShell promotes the first such line to a
# terminating error — which aborted a run on the harmless
# "extension already exists, skipping". The caller still checks $LASTEXITCODE,
# so real failures are caught by exit status rather than by stderr noise.
function Invoke-Docker {
    param([string[]]$DockerArgs)
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $out = & docker @DockerArgs 2>&1
        return @{ Output = $out; ExitCode = $LASTEXITCODE }
    } finally {
        $ErrorActionPreference = $previous
    }
}

Write-Step 'Preflight'
foreach ($f in @($SchemaPath, $SeedPath)) {
    if (-not (Test-Path $f)) { throw "Required SQL artifact missing: $f" }
    Write-Ok "found $(Split-Path -Leaf $f) ($([math]::Round((Get-Item $f).Length / 1KB)) KB)"
}

$info = Invoke-Docker @('info', '--format', '{{.ServerVersion}}')
if ($info.ExitCode -ne 0) { throw "Docker daemon unreachable: $($info.Output -join ' ')" }
Write-Ok "docker daemon $($info.Output)"

Write-Step 'Container'
$exists = (Invoke-Docker @('ps', '-a', '--filter', "name=^/$ContainerName$", '--format', '{{.Names}}')).Output
if ($Recreate -and $exists) {
    Write-Warn2 "removing existing $ContainerName (-Recreate)"
    Invoke-Docker @('rm', '-f', $ContainerName) | Out-Null
    $exists = $null
}

if (-not $exists) {
    Write-Host "  creating $ContainerName on 127.0.0.1:$Port ..."
    $run = Invoke-Docker @(
        'run', '-d',
        '--name', $ContainerName,
        '-e', "POSTGRES_USER=$DbUser",
        '-e', "POSTGRES_PASSWORD=$DbPassword",
        '-e', "POSTGRES_DB=$DbName",
        '-e', 'POSTGRES_INITDB_ARGS=--encoding=UTF8 --locale=C',
        '-p', "127.0.0.1:$Port`:5432",
        '-v', "${ContainerName}-data:/var/lib/postgresql/data",
        '--health-cmd', "pg_isready -U $DbUser -d $DbName",
        '--health-interval', '5s', '--health-timeout', '5s', '--health-retries', '10',
        '--restart', 'unless-stopped',
        $Image
    )
    if ($run.ExitCode -ne 0) { throw "docker run failed: $($run.Output -join ' ')" }
    Write-Ok "started container $($run.Output[0])"
} else {
    $running = (Invoke-Docker @('inspect', '-f', '{{.State.Running}}', $ContainerName)).Output
    if ($running -ne 'true') {
        Invoke-Docker @('start', $ContainerName) | Out-Null
        Write-Ok 'started existing container'
    } else {
        Write-Ok 'already running'
    }
}

Write-Step 'Waiting for readiness'
$ready = $false
for ($i = 1; $i -le 60; $i++) {
    $h = (Invoke-Docker @('inspect', '-f', '{{.State.Health.Status}}', $ContainerName)).Output
    if ($h -eq 'healthy') { $ready = $true; break }
    Start-Sleep -Milliseconds 1000
}
if (-not $ready) { throw 'container never became healthy' }
Write-Ok 'postgres is healthy'

# psql inside the container avoids needing a host psql client.
function Invoke-SqlFile {
    param([string]$Path, [string]$Label, [switch]$AllowFailure)
    Write-Host "  applying $Label ..."
    $tmp = "/tmp/$(Split-Path -Leaf $Path)"
    & docker cp $Path "${ContainerName}:$tmp" | Out-Null
    $r = Invoke-Docker @('exec', '-i', $ContainerName, 'psql', '-v', 'ON_ERROR_STOP=1', '-U', $DbUser, '-d', $DbName, '-f', $tmp)
    if ($r.ExitCode -ne 0) {
        $msg = ($r.Output | Where-Object { $_ -match 'ERROR|FATAL' } | Select-Object -First 5) -join ' | '
        if ($AllowFailure) { Write-Warn2 "$Label reported errors: $msg" }
        else { throw "$Label failed: $msg" }
    } else {
        Write-Ok "$Label applied"
    }
    return $r
}

Write-Step 'Applying schema'
Invoke-SqlFile -Path $SchemaPath -Label 'schema.sql' | Out-Null

Write-Step 'Verifying tables'
$tables = (Invoke-Docker @('exec', '-i', $ContainerName, 'psql', '-U', $DbUser, '-d', $DbName, '-t', '-A', '-c',
    "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;")).Output
Write-Ok "tables: $($tables -join ', ')"

Write-Step 'Applying seed'
Invoke-SqlFile -Path $SeedPath -Label 'seed_excel.sql' | Out-Null

Write-Step 'Row counts'
$counts = (Invoke-Docker @('exec', '-i', $ContainerName, 'psql', '-U', $DbUser, '-d', $DbName, '-t', '-A', '-F', ' = ', '-c',
    "SELECT 'categories', count(*) FROM categories
     UNION ALL SELECT 'subcategories', count(*) FROM subcategories
     UNION ALL SELECT 'merchants', count(*) FROM merchants
     UNION ALL SELECT 'items', count(*) FROM items;")).Output
foreach ($line in $counts) { if ($line.Trim()) { Write-Host "  $line" } }

$url = "postgresql://${DbUser}:${DbPassword}@127.0.0.1:${Port}/${DbName}"
Write-Step 'DATABASE_URL'
Write-Host "  $url" -ForegroundColor White

$envFile = Join-Path $RepoRoot '.env'
if (-not (Test-Path $envFile)) {
    Set-Content -Path $envFile -Value "DATABASE_URL=`"$url`"`nPORT=3001`n" -Encoding UTF8
    Write-Ok 'wrote .env'
} else {
    Write-Warn2 '.env already exists - left untouched (add DATABASE_URL manually if missing)'
}

Write-Host "`nPostgres ready." -ForegroundColor Green

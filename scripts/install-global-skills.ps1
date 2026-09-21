# scripts/install-global-skills.ps1
#
# Consolidates every agent skill found on this machine into ONE global store:
#   C:\Users\limta\.agents\skills
#
# Why: DSH discovers skills from that single location, so skills living in
# per-project folders (.agents/skills inside a repo) or in another harness's
# store (~/.claude/skills) are invisible to it.
#
# Safety rules:
#   * NEVER overwrites an existing skill. Conflicts are reported and skipped.
#   * Derives the target name from the SKILL.md `name:` frontmatter so the
#     folder name and the skill name cannot drift apart.
#   * Dry-run by default. Pass -Apply to actually copy.
#
# Usage:
#   powershell -File scripts/install-global-skills.ps1            # report only
#   powershell -File scripts/install-global-skills.ps1 -Apply     # install

[CmdletBinding()]
param(
    [switch]$Apply,
    [string]$Destination = "$env:USERPROFILE\.agents\skills"
)

$ErrorActionPreference = 'Stop'

# Every skill store discovered on this machine.
$Sources = @(
    "C:\Users\limta\Desktop\deepseek-harness\.agents\skills",
    "C:\Users\limta\Desktop\NEXG POS\.agents\skills",
    "C:\Users\limta\Desktop\NEXG-PLATFORM\.agents\skills",
    "C:\Users\limta\Desktop\watermelon-platform\skills",
    "$env:USERPROFILE\.claude\skills"
)

if (-not (Test-Path $Destination)) {
    New-Item -ItemType Directory -Force -Path $Destination | Out-Null
}

# Index what already exists, by folder name and by frontmatter name.
$existingFolders = @{}
Get-ChildItem $Destination -Directory -ErrorAction SilentlyContinue | ForEach-Object {
    $existingFolders[$_.Name] = $true
}

function Get-FrontmatterName {
    param([string]$SkillFile)
    if (-not (Test-Path $SkillFile)) { return $null }
    $match = Select-String -Path $SkillFile -Pattern '^name:\s*(.+?)\s*$' -ErrorAction SilentlyContinue |
        Select-Object -First 1
    if ($match) { return $match.Matches[0].Groups[1].Value.Trim().Trim('"').Trim("'") }
    return $null
}

$installed = @()
$skipped   = @()
$skippedNoManifest = @()

foreach ($source in $Sources) {
    if (-not (Test-Path $source)) { continue }

    foreach ($dir in (Get-ChildItem $source -Directory -ErrorAction SilentlyContinue)) {
        $skillFile = Join-Path $dir.FullName 'SKILL.md'

        if (-not (Test-Path $skillFile)) {
            $skippedNoManifest += "$($dir.Name)  <- $source"
            continue
        }

        $fmName = Get-FrontmatterName -SkillFile $skillFile
        $targetName = if ($fmName) { $fmName } else { $dir.Name }

        # Guard: refuse to clobber. Compare both the frontmatter name and the
        # folder name, because either can already occupy the global slot.
        if ($existingFolders.ContainsKey($targetName) -or $existingFolders.ContainsKey($dir.Name)) {
            $skipped += "$targetName  (already installed)"
            continue
        }

        $targetPath = Join-Path $Destination $targetName

        if ($Apply) {
            Copy-Item -Path $dir.FullName -Destination $targetPath -Recurse -Force
            $existingFolders[$targetName] = $true
        }

        $installed += "$targetName  <- $(Split-Path $source -Parent | Split-Path -Leaf)"
    }
}

Write-Host ''
Write-Host "Destination: $Destination" -ForegroundColor Cyan
Write-Host ''
Write-Host ("{0}: {1}" -f ($(if ($Apply) { 'INSTALLED' } else { 'WOULD INSTALL' }), $installed.Count)) -ForegroundColor Green
foreach ($item in ($installed | Sort-Object)) { Write-Host "  + $item" }

Write-Host ''
Write-Host "Skipped (already present): $($skipped.Count)" -ForegroundColor Yellow
foreach ($item in ($skipped | Sort-Object)) { Write-Host "  = $item" }

if ($skippedNoManifest.Count) {
    Write-Host ''
    Write-Host "Skipped (no SKILL.md, not a skill): $($skippedNoManifest.Count)" -ForegroundColor DarkYellow
    foreach ($item in ($skippedNoManifest | Sort-Object)) { Write-Host "  ? $item" }
}

if (-not $Apply) {
    Write-Host ''
    Write-Host 'Dry run. Re-run with -Apply to install.' -ForegroundColor Cyan
}

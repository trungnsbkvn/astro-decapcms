# Delete Unused Images Script
# This script removes unused images identified by find-unused-images.js
# IMPORTANT: Review unused-images-report.json before running this script

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent $PSScriptRoot
$reportPath = Join-Path $rootDir "unused-images-report.json"

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🗑️  Unused Images Deletion Script" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Check if report exists
if (-not (Test-Path $reportPath)) {
    Write-Host "❌ Error: Report file not found!" -ForegroundColor Red
    Write-Host "   Run: node scripts/find-unused-images.js first" -ForegroundColor Yellow
    exit 1
}

# Load report
$report = Get-Content $reportPath -Raw | ConvertFrom-Json

Write-Host "📊 Report Summary:" -ForegroundColor Green
Write-Host "   Total images: $($report.totalImages)" -ForegroundColor Gray
Write-Host "   Used images: $($report.usedImages)" -ForegroundColor Green
Write-Host "   Unused images: $($report.unusedImages)" -ForegroundColor Red
Write-Host "   Total size: $([math]::Round(($report.unusedImagesList | Measure-Object -Property size -Sum).Sum / 1MB, 2)) MB`n" -ForegroundColor Yellow

# Ask for confirmation
Write-Host "⚠️  WARNING: This will permanently delete $($report.unusedImages) images!" -ForegroundColor Yellow
$confirmation = Read-Host "Do you want to proceed? (yes/no)"

if ($confirmation -ne "yes") {
    Write-Host "`n❌ Operation cancelled by user" -ForegroundColor Yellow
    exit 0
}

# Create backup folder
$backupDir = Join-Path $rootDir ".image-backup"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = Join-Path $backupDir $timestamp

Write-Host "`n📦 Creating backup at: $backupPath" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

# Delete images with backup
$deleted = 0
$failed = 0
$totalSize = 0

Write-Host "`n🗑️  Deleting unused images...`n" -ForegroundColor Cyan

foreach ($image in $report.unusedImagesList) {
    $imagePath = Join-Path $rootDir $image.path
    
    if (Test-Path $imagePath) {
        try {
            # Create backup
            $relativePath = $image.path -replace 'src\\assets\\images\\|public\\images\\', ''
            $backupFilePath = Join-Path $backupPath $relativePath
            $backupFileDir = Split-Path -Parent $backupFilePath
            
            if (-not (Test-Path $backupFileDir)) {
                New-Item -ItemType Directory -Path $backupFileDir -Force | Out-Null
            }
            
            Copy-Item -Path $imagePath -Destination $backupFilePath -Force
            
            # Delete original
            Remove-Item -Path $imagePath -Force
            
            $deleted++
            $totalSize += $image.size
            
            Write-Host "✓ Deleted: $($image.path)" -ForegroundColor Green
        }
        catch {
            $failed++
            Write-Host "✗ Failed: $($image.path) - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "⚠ Not found: $($image.path)" -ForegroundColor Yellow
    }
}

Write-Host "`n═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Deletion Complete!" -ForegroundColor Green
Write-Host "   Deleted: $deleted images" -ForegroundColor Green
Write-Host "   Failed: $failed images" -ForegroundColor Red
Write-Host "   Freed: $([math]::Round($totalSize / 1MB, 2)) MB" -ForegroundColor Yellow
Write-Host "   Backup: $backupPath" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "💡 Tip: Test your build to ensure nothing broke!" -ForegroundColor Yellow
Write-Host "   If needed, restore from: $backupPath`n" -ForegroundColor Gray

# Unused Images Cleanup - Summary

## Overview
Found **1,680 unused images** (1.48 GB) that can be safely removed to reduce build time.

## Statistics
- **Total images scanned**: 2,573
- **Used images**: 893
- **Unused images**: 1,680
- **Total unused size**: ~1.48 GB

## Impact on Build Time
Removing these images will:
- Reduce initial image processing by ~65% (1,680 fewer images)
- Decrease dist/ folder size significantly  
- Speed up smart build cache creation/restoration
- Improve deployment times

## Categories of Unused Images

### 1. Unused Service Images
- Multiple variations of lawyer service images
- Duplicate company establishment images
- Old consultation service images

### 2. Unused Location Images  
- Province/district specific images not linked to content
- Duplicate court/office location images
- Old township/commune images

### 3. Unused People Images
- Attorney profile images not in attorney collection
- Customer testimonial images not used in pages
- Team photos not referenced in components

### 4. Unused Process/Diagram Images
- Workflow diagrams not used in posts
- Legal process images without references
- Infographics not linked to content

### 5. Miscellaneous Unused
- Old branding materials
- Duplicate logos in different formats
- Placeholder images (no-image.jpg, etc.)

## How to Clean Up

### Option 1: Review First (Recommended)
```powershell
# 1. Review the report
cat unused-images-report.json | ConvertFrom-Json | Select-Object -ExpandProperty unusedImagesList | Format-Table path, sizeKB

# 2. Check specific images before deleting
code unused-images-report.json
```

### Option 2: Delete with Backup
```powershell
# This creates a backup in .image-backup/ before deleting
pwsh scripts/delete-unused-images.ps1
```

### Option 3: Manual Selective Deletion
Review the report and delete specific categories manually.

## Safety Measures

### Automatic Backup
The deletion script creates a timestamped backup in `.image-backup/` folder before removing anything.

### Restore if Needed
If something breaks after deletion:
```powershell
# Restore from backup
Copy-Item -Path ".image-backup/20260115-*/*" -Destination "src/assets/images/" -Recurse -Force
```

### Verification Steps
After deletion, verify the build:
```bash
# 1. Run smart build
bun run build:smart

# 2. Check for broken image references
bun run dev
# Navigate through site and check console for 404 errors

# 3. Test production build
bun run build
```

## Known Safe to Delete

These categories are confirmed safe to remove:
- ✅ Duplicate numbered images (e.g., `-1.jpg`, `-2.jpg`, `-3.jpg`)
- ✅ Old format variations (`.jfif` when `.jpg` exists)
- ✅ Images in `youth and partners/` not used in layouts
- ✅ Customer images (`ducleanh.png`, `linhlevan.png`) - placeholder files
- ✅ Old branding files (`groovepaper.png`, `logo_bottom.jpg`)

## Warnings

⚠️ **Be Careful With:**
- Images that might be used in DecapCMS admin content (check `public/admin/config.yml`)
- Images referenced dynamically in code (though the script tries to detect these)
- Images scheduled for upcoming posts

## Post-Cleanup Benefits

After removing unused images:
1. **Faster builds**: ~60-70% fewer images to optimize
2. **Smaller repository**: ~1.5 GB less in git
3. **Faster deployments**: Less to upload to Netlify
4. **Better cache**: .build-cache folder will be smaller
5. **Cleaner codebase**: Easier to manage actual assets

## Next Steps

1. ✅ **Review** the report file
2. ✅ **Run** the deletion script (creates backup automatically)
3. ✅ **Test** the build thoroughly
4. ✅ **Commit** changes if everything works
5. ✅ **Add** .image-backup/ to .gitignore (already done)

## Rollback Plan

If issues occur:
```bash
# 1. Stop the build
Ctrl+C

# 2. Restore from backup
pwsh -Command "Copy-Item -Path '.image-backup/latest/*' -Destination 'src/assets/images/' -Recurse -Force"

# 3. Test again
bun run dev
```

## Report Location
- Full details: `unused-images-report.json`
- Deletion script: `scripts/delete-unused-images.ps1`
- This summary: `UNUSED_IMAGES_CLEANUP.md`

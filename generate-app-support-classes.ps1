# ixtlan-structure.ps1
#
# Purpose: Creates support files for ixtlan component showcase/playground
#
# Naming Conventions:
# ------------------
# .handler.ts  - For event handling, callbacks, user interactions
# .provider.ts - For supplying data, configurations, options
# .manager.ts  - For state management, lifecycle, coordinating operations
# .helper.ts   - For utility functions, transformations, common operations
# .model.ts    - For data structures and their behaviors
#
# Example: 
# - table/ixt-table.provider.ts -> supplies table configurations and data
# - table/ixt-table.handler.ts  -> manages table events like sorting, selection
#
# Organization:
# Each component gets its own directory, with support files split by responsibility.
# This keeps the code organized while maintaining single responsibility principle.

$baseDir = ".\src\app"

# Define component directories and their files
$components = @{
   "table" = @("ixt-table.provider.ts", "ixt-table.handler.ts")
   "tree" = @("ixt-tree.provider.ts", "ixt-tree.handler.ts")
   "layer" = @("ixt-layer.provider.ts", "ixt-layer.manager.ts")
   "dialog" = @("ixt-dialog.handler.ts")
   "expression" = @("ixt-expression.provider.ts", "ixt-expression.helper.ts")
   "autocomplete" = @("ixt-autocomplete.provider.ts", "ixt-autocomplete.handler.ts")
}

# Track what was created
$created = @()
$skipped = @()

# Create directories and files
foreach ($component in $components.Keys) {
   # Create component directory if it doesn't exist
   $componentDir = Join-Path $baseDir $component
   if (-not (Test-Path $componentDir)) {
       New-Item -ItemType Directory -Path $componentDir -Force
       $created += "Directory: $componentDir"
   }

   # Create files for the component
   foreach ($file in $components[$component]) {
       $filePath = Join-Path $componentDir $file
       
       # Check if file already exists
       if (Test-Path $filePath) {
           $skipped += $filePath
           continue
       }
       
       # Create new file
       New-Item -ItemType File -Path $filePath -Force
       
       # Add basic class structure to each file
       $className = $file -replace '\.ts$', '' -replace '-([a-z])', { $_.Groups[1].Value.ToUpper() } -replace '^([a-z])', { $_.Groups[1].Value.ToUpper() }
       $content = @"
export class $className {
   // TODO: Implement $className
}
"@
       Set-Content -Path $filePath -Value $content
       $created += $filePath
   }
}

# Report results
Write-Host "`nIxtlan component support structure processing complete!`n"

if ($created.Count -gt 0) {
   Write-Host "Created:"
   $created | ForEach-Object { Write-Host "  $_" }
}

if ($skipped.Count -gt 0) {
   Write-Host "`nSkipped (already exists):"
   $skipped | ForEach-Object { Write-Host "  $_" }
}

if ($created.Count -eq 0) {
   Write-Host "No new files were created - structure is already in place."
}
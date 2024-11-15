# PowerShell script to generate Angular components for the specified directories
$basePath = "src/components"
$components = @(
    "ixt-layer-manager"
)

foreach ($component in $components) {
    $componentPath = "$basePath\$component"
    Write-Host "Generating component for $component..."

    # Generate the Angular component with SCSS and without adding to any module
    ng generate component $componentPath --skip-import --style=scss

    # Remove the generated .tsconfig file if present
    $tsConfigFile = "$componentPath/tsconfig.json"
    if (Test-Path $tsConfigFile) {
        Remove-Item $tsConfigFile -Force
        Write-Host "Removed $tsConfigFile"
    }

    Write-Host "Component $component generated successfully."
}

Write-Host "All components have been generated."

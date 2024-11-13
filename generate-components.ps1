# PowerShell script to generate Angular components for the specified directories
$basePath = "src/components"
$components = @(
    "ixt-bread-crumb",
    "ixt-button",
    "ixt-calendar",
    "ixt-dialog",
    "ixt-form",
    "ixt-geo-map",
    "ixt-image",
    "ixt-input",
    "ixt-menu",
    "ixt-panel",
    "ixt-progress",
    "ixt-select",
    "ixt-table-tree",
    "ixt-text",
    "ixt-text-editor",
    "ixt-tree"
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

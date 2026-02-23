# Build Standalone Bundle Script
# Combines all JS files into a single bundle without ES6 modules

$outputFile = "js\game-bundle.js"
$files = @(
    "js\config.js",            # Configuration (easy-to-change settings) - MUST BE FIRST
    "js\cards.js",             # Card database (all 52 cards)
    "js\deck.js",              # Deck management (shuffling, drawing)
    "js\board.js",             # Board/grid management (3x3 grid)
    "js\layers.js",            # Layer system (6 reality layers)
    "js\intuition.js",         # Intuition check system
    "js\battlelog.js",         # Battle log (event tracking)
    "js\ai.js",                # AI opponent
    "js\audio-manager.js",     # Audio system with correct file paths
    "js\intro-sequence.js",    # Star Wars-style intro sequence
    "js\title-screen.js",      # Title screen display
    "js\dice-mechanic.js",     # Optional Depth Die (d6) mechanic
    "js\card-flip.js",         # Card flip animation
    "js\damage-numbers.js",    # Damage number popups
    "js\pause-menu.js",        # Pause menu system
    "js\in-game-settings.js",  # In-game settings button
    "js\card-tooltips.js",     # Card hover tooltips
    "js\layer-shift-effects.js", # Layer shift visual effects
    "js\victory-loss-screens.js", # Victory/loss screens
    "js\campaign-new.js",      # Campaign mode with 9 boards
    "js\card-animations.js",   # Card animation system
    "js\tutorial-chapters.js", # Tutorial chapter system
    "js\ui.js",                # UI manager (visual updates)
    "js\game.js"               # Core game engine (main logic)
)

Write-Host "Building standalone bundle..." -ForegroundColor Green

$content = "// FUM: Shatterlayers - Standalone Bundle (No Server Required)`n"
$content += "// Auto-generated bundle - combines all game files`n`n"
$content += "(function() {`n'use strict';`n`n"

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..." -ForegroundColor Yellow
        $fileContent = Get-Content $file -Raw
        
        # Remove import statements
        $fileContent = $fileContent -replace 'import\s+.*?from\s+[''"].*?[''"];?\s*', ''
        
        # Remove export statements but keep the declarations
        # IMPORTANT: Remove "export { x }" first, then other exports (else we get leftover "{ x };")
        $fileContent = $fileContent -replace 'export\s*\{[^}]*\}\s*;?\s*', ''
        $fileContent = $fileContent -replace 'export\s+(const|let|var|function|class)\s+', '$1 '
        $fileContent = $fileContent -replace 'export\s+', ''
        
        $content += "// ===== $file =====`n"
        $content += $fileContent
        $content += "`n`n"
    } else {
        Write-Host "Warning: $file not found" -ForegroundColor Red
    }
}

$content += "})();`n"

# Fix spread operator for older browsers  
$content = $content -replace '\.\.\.(\w+)', 'Object.assign({}, $1)'

Set-Content -Path $outputFile -Value $content

Write-Host "`nBundle created: $outputFile" -ForegroundColor Green
Write-Host "File size: $((Get-Item $outputFile).Length) bytes" -ForegroundColor Cyan

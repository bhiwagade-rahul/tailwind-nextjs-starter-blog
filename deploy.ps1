# Desi Show Biz - Simple Deployment Script

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"

function Write-ColoredOutput {
    param([string]$Message, [string]$Color = "White")

    # Validate color parameter and default to White if invalid
    $validColors = @("Black", "DarkBlue", "DarkGreen", "DarkCyan", "DarkRed", "DarkMagenta", "DarkYellow", "Gray", "DarkGray", "Blue", "Green", "Cyan", "Red", "Magenta", "Yellow", "White")
    if ($Color -notin $validColors) {
        $Color = "White"
    }

    Write-Host $Message -ForegroundColor $Color
}

function Test-Prerequisites {
    Write-ColoredOutput "Checking prerequisites..." $Yellow

    # Check if Docker is installed
    try {
        $null = docker version
    }
    catch {
        Write-ColoredOutput "❌ Docker is not installed or not running. Please install Docker Desktop." $Red
        exit 1
    }

    # Check if kubectl is available
    try {
        $null = kubectl version --client
    }
    catch {
        Write-ColoredOutput "❌ kubectl is not installed. Please install kubectl." $Red
        exit 1
    }

    # Check if helm is available
    try {
        $null = helm version
    }
    catch {
        Write-ColoredOutput "❌ Helm is not installed. Please install Helm." $Red
        exit 1
    }

    Write-ColoredOutput "✅ All prerequisites are installed" $Green
}

function Deploy-Application {
    Write-ColoredOutput "🚀 Starting deployment..." $Green

    # Delete older image from local
    Write-ColoredOutput "🗑️ Deleting older image from local..." $Yellow
    docker image rm rahulbhiwagade122/desishowbiz 2>$null | Out-Null
    Write-ColoredOutput "✅ Image deleted..." $Green

    # Build Docker images
    Write-ColoredOutput "📦 Building Docker images..." $Yellow
    docker compose -f docker-compose.prod.yml build
    if ($LASTEXITCODE -ne 0) {
        Write-ColoredOutput "❌ Failed to build Docker images" $Red
        exit 1
    }
    Write-ColoredOutput "✅ Docker images built successfully..." $Green

    # Tag Docker images
    Write-ColoredOutput "🏷️ Tagging Docker images..." $Yellow
    docker tag desishowbiz-nextjs-blog-frontend rahulbhiwagade122/desishowbiz
    if ($LASTEXITCODE -ne 0) {
        Write-ColoredOutput "❌ Failed to tag Docker images" $Red
        exit 1
    }
    Write-ColoredOutput "✅ Docker images tagged successfully..." $Green

    # Push Docker images to Docker Hub
    Write-ColoredOutput "⬆️ Pushing Docker images to Docker Hub..." $Yellow
    docker push rahulbhiwagade122/desishowbiz:latest
    if ($LASTEXITCODE -ne 0) {
        Write-ColoredOutput "❌ Failed to push Docker images" $Red
        exit 1
    }
    Write-ColoredOutput "✅ Docker images pushed successfully..." $Green

    # Deploy with Helm
    Write-ColoredOutput "🌟 Deploying with Helm..." $Yellow
    helm upgrade my-desishowbiz-frontend ./charts/desishowbiz-frontend
    if ($LASTEXITCODE -ne 0) {
        Write-ColoredOutput "❌ Failed to deploy with Helm" $Red
        exit 1
    }
    Write-ColoredOutput "✅ Application deployed successfully" $Green

    # Show status
    Write-ColoredOutput ""
    Write-ColoredOutput "📊 Deployment Status:" $Yellow
    helm list
    Write-ColoredOutput ""
    kubectl get pods -l app=desishowbiz-frontend
    Write-ColoredOutput ""
    Write-ColoredOutput "🎉 Deployment completed successfully!" $Green
}

# Main execution
Write-ColoredOutput "🌟 Desi Show Biz - One-Click Deployment" $Green
Write-ColoredOutput ""

Test-Prerequisites
Deploy-Application

#Requires -Version 5.1

# Desi Show Biz - Enhanced Deployment Script with Admin Privileges

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

function Test-AdministratorPrivileges {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    $isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

    if (-not $isAdmin) {
        Write-ColoredOutput "❌ This script requires Administrator privileges for Docker operations." $Red
        Write-ColoredOutput "Please run PowerShell as Administrator and try again." $Yellow
        Write-ColoredOutput ""
        Write-ColoredOutput "To run as Administrator:" $Yellow
        Write-ColoredOutput "1. Right-click on PowerShell" $Yellow
        Write-ColoredOutput "2. Select 'Run as Administrator'" $Yellow
        Write-ColoredOutput "3. Navigate to the script directory" $Yellow
        Write-ColoredOutput "4. Run: .\deploy.ps1" $Yellow
        exit 1
    }

    Write-ColoredOutput "✅ Running with Administrator privileges" $Green
}

function Test-Prerequisites {
    Write-ColoredOutput "Checking prerequisites..." $Yellow

    # Check if Docker is installed and running
    Write-ColoredOutput "🔍 Checking Docker..." $Yellow
    try {
        $dockerVersion = docker version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-ColoredOutput "✅ Docker is installed and running" $Green
        } else {
            throw "Docker command failed"
        }
    }
    catch {
        Write-ColoredOutput "❌ Docker is not installed or not running. Please install Docker Desktop and start it." $Red
        Write-ColoredOutput "   Visit: https://docs.docker.com/desktop/install/windows-install/" $Yellow
        exit 1
    }

    # Check if Docker Compose is available
    Write-ColoredOutput "🔍 Checking Docker Compose..." $Yellow
    try {
        $composeVersion = docker compose version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-ColoredOutput "✅ Docker Compose is available" $Green
        } else {
            throw "Docker Compose command failed"
        }
    }
    catch {
        Write-ColoredOutput "❌ Docker Compose is not available. Please update Docker Desktop." $Red
        exit 1
    }

    # Check if kubectl is available
    Write-ColoredOutput "🔍 Checking kubectl..." $Yellow
    try {
        $kubectlVersion = kubectl version --client 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-ColoredOutput "✅ kubectl is installed" $Green
        } else {
            throw "kubectl command failed"
        }
    }
    catch {
        Write-ColoredOutput "❌ kubectl is not installed. Please install kubectl." $Red
        Write-ColoredOutput "   Visit: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/" $Yellow
        exit 1
    }

    # Check if helm is available
    Write-ColoredOutput "🔍 Checking Helm..." $Yellow
    try {
        $helmVersion = helm version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-ColoredOutput "✅ Helm is installed" $Green
        } else {
            throw "Helm command failed"
        }
    }
    catch {
        Write-ColoredOutput "❌ Helm is not installed. Please install Helm." $Red
        Write-ColoredOutput "   Visit: https://helm.sh/docs/intro/install/" $Yellow
        exit 1
    }

    Write-ColoredOutput "✅ All prerequisites are installed and working" $Green
}

function Deploy-Application {
    Write-ColoredOutput "🚀 Starting deployment..." $Green

    # Check if docker-compose.prod.yml exists
    if (-not (Test-Path "docker-compose.prod.yml")) {
        Write-ColoredOutput "❌ docker-compose.prod.yml not found in current directory" $Red
        exit 1
    }

    # Check if charts directory exists
    if (-not (Test-Path "charts/desishowbiz-frontend")) {
        Write-ColoredOutput "❌ Helm chart not found at ./charts/desishowbiz-frontend" $Red
        exit 1
    }

    # Delete older image from local (with force to avoid prompts)
    Write-ColoredOutput "🗑️ Cleaning up old images..." $Yellow
    try {
        $existingImages = docker images -q rahulbhiwagade122/desishowbiz 2>$null
        if ($existingImages) {
            docker rmi $existingImages 2>$null | Out-Null
            Write-ColoredOutput "✅ Old images cleaned up" $Green
        } else {
            Write-ColoredOutput "ℹ️ No existing images to clean up" $Yellow
        }
    }
    catch {
        Write-ColoredOutput "⚠️ Could not clean up old images (continuing anyway)" $Yellow
    }

    # Build Docker images with better error handling
    Write-ColoredOutput "📦 Building Docker images..." $Yellow
    try {
        Write-ColoredOutput "   Building production image..." $Yellow
        $buildResult = docker compose -f docker-compose.prod.yml build 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-ColoredOutput "❌ Failed to build Docker images" $Red
            Write-ColoredOutput "Build output: $buildResult" $Red
            exit 1
        }
        Write-ColoredOutput "✅ Docker images built successfully" $Green
    }
    catch {
        Write-ColoredOutput "❌ Exception during Docker build: $($_.Exception.Message)" $Red
        exit 1
    }

    # Verify image was built
    Write-ColoredOutput "🔍 Verifying built image..." $Yellow
    try {
        $builtImage = docker images desishowbiz-nextjs-blog-frontend --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
        if (-not $builtImage) {
            Write-ColoredOutput "❌ Built image not found" $Red
            exit 1
        }
        Write-ColoredOutput "✅ Image verification successful" $Green
        Write-ColoredOutput "$builtImage" $Green
    }
    catch {
        Write-ColoredOutput "❌ Could not verify built image" $Red
        exit 1
    }

    # Tag Docker images
    Write-ColoredOutput "🏷️ Tagging Docker images..." $Yellow
    try {
        docker tag desishowbiz-nextjs-blog-frontend:latest rahulbhiwagade122/desishowbiz:latest
        if ($LASTEXITCODE -ne 0) {
            Write-ColoredOutput "❌ Failed to tag Docker images" $Red
            exit 1
        }
        Write-ColoredOutput "✅ Docker images tagged successfully" $Green
    }
    catch {
        Write-ColoredOutput "❌ Exception during image tagging: $($_.Exception.Message)" $Red
        exit 1
    }

    # Push Docker images to Docker Hub with retry logic
    Write-ColoredOutput "⬆️ Pushing Docker images to Docker Hub..." $Yellow
    try {
        Write-ColoredOutput "   This may take several minutes..." $Yellow
        $pushResult = docker push rahulbhiwagade122/desishowbiz:latest 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-ColoredOutput "❌ Failed to push Docker images" $Red
            Write-ColoredOutput "Push output: $pushResult" $Red
            Write-ColoredOutput ""
            Write-ColoredOutput "Troubleshooting tips:" $Yellow
            Write-ColoredOutput "1. Check your Docker Hub credentials" $Yellow
            Write-ColoredOutput "2. Ensure you are logged in: docker login" $Yellow
            Write-ColoredOutput "3. Verify repository exists on Docker Hub" $Yellow
            exit 1
        }
        Write-ColoredOutput "✅ Docker images pushed successfully" $Green
    }
    catch {
        Write-ColoredOutput "❌ Exception during push: $($_.Exception.Message)" $Red
        exit 1
    }

    # Deploy with Helm
    Write-ColoredOutput "🌟 Deploying with Helm..." $Yellow
    try {
        Write-ColoredOutput "   Upgrading Helm release..." $Yellow
        $helmResult = helm upgrade my-desishowbiz-frontend ./charts/desishowbiz-frontend 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-ColoredOutput "❌ Failed to deploy with Helm" $Red
            Write-ColoredOutput "Helm output: $helmResult" $Red
            Write-ColoredOutput ""
            Write-ColoredOutput "Troubleshooting tips:" $Yellow
            Write-ColoredOutput "1. Check if Kubernetes cluster is running" $Yellow
            Write-ColoredOutput "2. Verify kubectl context: kubectl config current-context" $Yellow
            Write-ColoredOutput "3. Check cluster connectivity: kubectl cluster-info" $Yellow
            exit 1
        }
        Write-ColoredOutput "✅ Application deployed successfully" $Green
    }
    catch {
        Write-ColoredOutput "❌ Exception during Helm deployment: $($_.Exception.Message)" $Red
        exit 1
    }

    # Show deployment status with better formatting
    Write-ColoredOutput ""
    Write-ColoredOutput "📊 Deployment Status:" $Yellow
    Write-ColoredOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" $Yellow

    try {
        Write-ColoredOutput "Helm Releases:" $Yellow
        helm list --all-namespaces | Format-Table -AutoSize
    }
    catch {
        Write-ColoredOutput "⚠️ Could not retrieve Helm status: $($_.Exception.Message)" $Yellow
    }

    Write-ColoredOutput ""
    try {
        Write-ColoredOutput "Application Pods:" $Yellow
        kubectl get pods -l app=desishowbiz-frontend --all-namespaces | Format-Table -AutoSize
    }
    catch {
        Write-ColoredOutput "⚠️ Could not retrieve pod status: $($_.Exception.Message)" $Yellow
    }

    Write-ColoredOutput ""
    Write-ColoredOutput "🎉 Deployment completed successfully!" $Green
    Write-ColoredOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" $Green
}

function Test-DockerLogin {
    Write-ColoredOutput "🔐 Checking Docker Hub authentication..." $Yellow

    try {
        # Try to get Docker Hub registry info (this will fail if not logged in)
        $registryInfo = docker info 2>$null | Select-String "Registry"
        if ($registryInfo) {
            Write-ColoredOutput "✅ Docker Hub authentication verified" $Green
            return $true
        }
    }
    catch {
        # This is expected if not logged in
    }

    Write-ColoredOutput "⚠️ Docker Hub login required" $Yellow
    Write-ColoredOutput "Please log in to Docker Hub first:" $Yellow
    Write-ColoredOutput "   docker login" $Yellow
    Write-ColoredOutput ""
    Write-ColoredOutput "Then run this script again." $Yellow

    $login = Read-Host "Are you logged in to Docker Hub? (y/N)"
    if ($login -ne "y" -and $login -ne "Y") {
        Write-ColoredOutput "❌ Docker Hub login required. Exiting." $Red
        exit 1
    }

    return $true
}

# Main execution
Write-ColoredOutput "🌟 Desi Show Biz - One-Click Deployment" $Green
Write-ColoredOutput "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" $Green
Write-ColoredOutput ""

# Check execution policy and suggest fix if needed
try {
    $executionPolicy = Get-ExecutionPolicy -Scope CurrentUser
    if ($executionPolicy -eq "Restricted") {
        Write-ColoredOutput "⚠️ PowerShell execution policy is Restricted" $Yellow
        Write-ColoredOutput "To fix this, run the following command in a new PowerShell window:" $Yellow
        Write-ColoredOutput "   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" $Yellow
        Write-ColoredOutput ""
    }
}
catch {
    Write-ColoredOutput "ℹ️ Could not check execution policy" $Yellow
}

Test-AdministratorPrivileges
Test-Prerequisites

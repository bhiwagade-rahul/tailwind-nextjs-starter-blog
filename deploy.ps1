# Desi Show Biz - PowerShell Deployment Script

param(
    [string]$Action = "deploy",
    [string]$Environment = "development"
)

# Configuration
$APP_NAME = "desishowbiz-frontend"
$DOCKER_REPO = "rahulbhiwagade122/desishowbiz"
$IMAGE_TAG = "latest"
$NAMESPACE = "default"
$HELM_RELEASE = "my-$APP_NAME"

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"

function Write-ColoredOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Show-Help {
    Write-ColoredOutput "Desi Show Biz - PowerShell Deployment Script" $Green
    Write-ColoredOutput ""
    Write-ColoredOutput "Usage: .\deploy.ps1 [action] [environment]" $Yellow
    Write-ColoredOutput ""
    Write-ColoredOutput "Actions:" $Yellow
    Write-ColoredOutput "  build     - Build Docker image"
    Write-ColoredOutput "  push      - Push Docker image to registry"
    Write-ColoredOutput "  deploy    - Deploy application using Helm (default)"
    Write-ColoredOutput "  status    - Show deployment status"
    Write-ColoredOutput "  logs      - Show application logs"
    Write-ColoredOutput "  restart   - Restart deployment"
    Write-ColoredOutput "  clean     - Clean up Docker images"
    Write-ColoredOutput ""
    Write-ColoredOutput "Environments:" $Yellow
    Write-ColoredOutput "  development - Development environment (default)"
    Write-ColoredOutput "  staging     - Staging environment"
    Write-ColoredOutput "  production  - Production environment"
}

function Test-Prerequisites {
    # Check if Docker is installed
    try {
        $null = docker version
    }
    catch {
        Write-ColoredOutput "Docker is not installed or not running. Please install Docker Desktop." $Red
        exit 1
    }

    # Check if kubectl is available
    try {
        $null = kubectl version --client
    }
    catch {
        Write-ColoredOutput "kubectl is not installed. Please install kubectl." $Red
        exit 1
    }

    # Check if helm is available
    try {
        $null = helm version
    }
    catch {
        Write-ColoredOutput "Helm is not installed. Please install Helm." $Red
        exit 1
    }
}

function Build-DockerImage {
    Write-ColoredOutput "Building Docker image..." $Green
    docker build -t "$DOCKER_REPO`:$IMAGE_TAG" .
    if ($LASTEXITCODE -eq 0) {
        Write-ColoredOutput "Docker image built successfully" $Green
    } else {
        Write-ColoredOutput "Failed to build Docker image" $Red
        exit 1
    }
}

function Push-DockerImage {
    Write-ColoredOutput "Pushing Docker image..." $Green
    docker push "$DOCKER_REPO`:$IMAGE_TAG"
    if ($LASTEXITCODE -eq 0) {
        Write-ColoredOutput "Docker image pushed successfully" $Green
    } else {
        Write-ColoredOutput "Failed to push Docker image" $Red
        exit 1
    }
}

function Deploy-Application {
    Write-ColoredOutput "Deploying application with Helm..." $Green

    $valuesFile = "charts/$APP_NAME/values.yaml"
    if ($Environment -eq "staging") {
        $valuesFile = "charts/$APP_NAME/values-staging.yaml"
    } elseif ($Environment -eq "production") {
        $valuesFile = "charts/$APP_NAME/values-production.yaml"
    }

    helm upgrade --install $HELM_RELEASE "charts/$APP_NAME" `
        --namespace $NAMESPACE `
        --create-namespace `
        --wait

    if ($LASTEXITCODE -eq 0) {
        Write-ColoredOutput "Application deployed successfully" $Green
    } else {
        Write-ColoredOutput "Failed to deploy application" $Red
        exit 1
    }
}

function Show-Status {
    Write-ColoredOutput "Checking deployment status..." $Green

    Write-ColoredOutput "Helm Releases:" $Yellow
    helm list -n $NAMESPACE

    Write-ColoredOutput "Pods:" $Yellow
    kubectl get pods -n $NAMESPACE -l "app=$APP_NAME"

    Write-ColoredOutput "Services:" $Yellow
    kubectl get services -n $NAMESPACE -l "app=$APP_NAME"
}

function Show-Logs {
    Write-ColoredOutput "Showing application logs..." $Green
    kubectl logs -f -n $NAMESPACE -l "app=$APP_NAME"
}

function Restart-Deployment {
    Write-ColoredOutput "Restarting deployment..." $Green
    kubectl rollout restart deployment/$HELM_RELEASE -n $NAMESPACE
    Write-ColoredOutput "Deployment restarted" $Green
}

function Clean-DockerImages {
    Write-ColoredOutput "Cleaning up Docker images..." $Green
    docker image prune -f
    docker images | Select-String $APP_NAME | ForEach-Object {
        $imageId = ($_ -split '\s+')[2]
        if ($imageId) {
            docker rmi -f $imageId 2>$null | Out-Null
        }
    }
    Write-ColoredOutput "Cleanup completed" $Green
}

# Main execution
Test-Prerequisites

switch ($Action) {
    "build" {
        Build-DockerImage
    }
    "push" {
        Push-DockerImage
    }
    "deploy" {
        Deploy-Application
    }
    "status" {
        Show-Status
    }
    "logs" {
        Show-Logs
    }
    "restart" {
        Restart-Deployment
    }
    "clean" {
        Clean-DockerImages
    }
    default {
        Write-ColoredOutput "Unknown action: $Action" $Red
        Show-Help
        exit 1
    }
}

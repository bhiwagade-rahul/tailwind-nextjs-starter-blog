# Desi Show Biz - Deployment Makefile

# Variables
APP_NAME := desishowbiz-frontend
DOCKER_REPO := rahulbhiwagade122/desishowbiz
IMAGE_TAG := latest
NAMESPACE := default
HELM_RELEASE := my-$(APP_NAME)

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help build push deploy status logs clean rollback update-deps

# Default target
help: ## Show this help message
	@echo "Desi Show Biz - Deployment Makefile"
	@echo ""
	@echo "Available targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  ${YELLOW}%-20s${NC} %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Docker targets
build: ## Build Docker image
	@echo "${GREEN}Building Docker image...${NC}"
	docker build -t $(DOCKER_REPO):$(IMAGE_TAG) .
	@echo "${GREEN}Docker image built successfully${NC}"

build-prod: ## Build Docker image for production
	@echo "${GREEN}Building production Docker image...${NC}"
	docker build -f Dockerfile.prod -t $(DOCKER_REPO):$(IMAGE_TAG) .
	@echo "${GREEN}Production Docker image built successfully${NC}"

push: ## Push Docker image to registry
	@echo "${GREEN}Pushing Docker image...${NC}"
	docker push $(DOCKER_REPO):$(IMAGE_TAG)
	@echo "${GREEN}Docker image pushed successfully${NC}"

# Kubernetes targets
deploy: ## Deploy application using Helm
	@echo "${GREEN}Deploying application with Helm...${NC}"
	@echo "${GREEN}Deleting older image from local...${NC}"
	docker image rm rahulbhiwagade122/desishowbiz 
	@echo "${GREEN}Image deleted...${NC}"

	@echo "${GREEN}Building Docker images...${NC}"
	docker compose -f docker-compose.prod.yml build
	@echo "${GREEN}Docker images built successfully...${NC}"


	@echo "${GREEN}Tagging Docker images...${NC}"	 	
	docker tag desishowbiz-nextjs-blog-frontend rahulbhiwagade122/desishowbiz
	@echo "${GREEN}Docker images tagged successfully...${NC}"

	@echo "${GREEN}Pushing Docker images to Docker Hub...${NC}"
	docker push rahulbhiwagade122/desishowbiz:latest
	@echo "${GREEN}Docker images pushed successfully...${NC}"

	@echo "${GREEN}Deploying with Helm...${NC}"
	helm upgrade my-desishowbiz-frontend ./charts/desishowbiz-frontend
	@echo "${GREEN}Application deployed successfully${NC}"

deploy-dry-run: ## Dry run of Helm deployment
	@echo "${GREEN}Dry run of Helm deployment...${NC}"
	helm upgrade --install $(HELM_RELEASE) ./charts/$(APP_NAME) \
		--namespace $(NAMESPACE) \
		--create-namespace \
		--dry-run

status: ## Show deployment status
	@echo "${GREEN}Checking deployment status...${NC}"
	@echo ""
	@echo "${YELLOW}Helm Releases:${NC}"
	helm list -n $(NAMESPACE)
	@echo ""
	@echo "${YELLOW}Pods:${NC}"
	kubectl get pods -n $(NAMESPACE) -l app=$(APP_NAME)
	@echo ""
	@echo "${YELLOW}Services:${NC}"
	kubectl get services -n $(NAMESPACE) -l app=$(APP_NAME)

logs: ## Show application logs
	@echo "${GREEN}Showing application logs...${NC}"
	kubectl logs -f -n $(NAMESPACE) -l app=$(APP_NAME)

# Development targets
dev-up: ## Start local development environment
	@echo "${GREEN}Starting local development environment...${NC}"
	docker-compose up -d

dev-down: ## Stop local development environment
	@echo "${GREEN}Stopping local development environment...${NC}"
	docker-compose down

# Maintenance targets
restart: ## Restart the deployment
	@echo "${GREEN}Restarting deployment...${NC}"
	kubectl rollout restart deployment/$(HELM_RELEASE) -n $(NAMESPACE)
	@echo "${GREEN}Deployment restarted${NC}"

rollback: ## Rollback to previous version
	@echo "${GREEN}Rolling back to previous version...${NC}"
	helm rollback $(HELM_RELEASE) -n $(NAMESPACE)
	@echo "${GREEN}Rollback completed${NC}"

update-deps: ## Update Helm dependencies
	@echo "${GREEN}Updating Helm dependencies...${NC}"
	helm dependency update ./charts/$(APP_NAME)
	@echo "${GREEN}Dependencies updated${NC}"

# Cleanup targets
clean: ## Clean up local Docker images
	@echo "${GREEN}Cleaning up Docker images...${NC}"
	docker image prune -f
	docker images | grep $(APP_NAME) | awk '{print $$3}' | xargs docker rmi -f 2>/dev/null || true
	@echo "${GREEN}Cleanup completed${NC}"

clean-all: clean ## Clean up everything including deployments
	@echo "${YELLOW}WARNING: This will remove all deployments!${NC}"
	@echo "Press Ctrl+C within 5 seconds to cancel..."
	@sleep 5
	@echo "${RED}Removing all deployments...${NC}"
	helm uninstall $(HELM_RELEASE) -n $(NAMESPACE) || true
	kubectl delete namespace $(NAMESPACE) --ignore-not-found=true || true
	@echo "${GREEN}All deployments removed${NC}"

# Utility targets
shell: ## Get shell access to the running container
	@echo "${GREEN}Getting shell access...${NC}"
	kubectl exec -it -n $(NAMESPACE) -l app=$(APP_NAME) -- /bin/sh

port-forward: ## Port forward to access the application locally
	@echo "${GREEN}Port forwarding...${NC}"
	kubectl port-forward -n $(NAMESPACE) svc/$(HELM_RELEASE) 3000:3000

# Environment specific targets
staging: ## Deploy to staging environment
	@echo "${GREEN}Deploying to staging...${NC}"
	helm upgrade --install $(HELM_RELEASE)-staging ./charts/$(APP_NAME) \
		--namespace staging \
		--create-namespace \
		--values ./charts/$(APP_NAME)/values-staging.yaml \
		--wait

production: ## Deploy to production environment
	@echo "${GREEN}Deploying to production...${NC}"
	@echo "${YELLOW}Make sure your values.yaml has production settings!${NC}"
	helm upgrade --install $(HELM_RELEASE) ./charts/$(APP_NAME) \
		--namespace production \
		--create-namespace \
		--values ./charts/$(APP_NAME)/values-production.yaml \
		--wait

# Validation targets
validate: ## Validate Helm charts
	@echo "${GREEN}Validating Helm charts...${NC}"
	helm lint ./charts/$(APP_NAME)
	@echo "${GREEN}Helm charts are valid${NC}"

template: ## Show rendered Kubernetes templates
	@echo "${GREEN}Showing rendered templates...${NC}"
	helm template $(HELM_RELEASE) ./charts/$(APP_NAME) -n $(NAMESPACE)

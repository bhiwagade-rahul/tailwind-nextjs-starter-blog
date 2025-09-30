# DesiShowbiz Website Deployment Guide

This guide provides a comprehensive step-by-step process for deploying and maintaining the DesiShowbiz Next.js blog website on Google Kubernetes Engine (GKE).

## 🚀 Quick Start

### Prerequisites
- Google Cloud CLI (`gcloud`)
- Kubernetes CLI (`kubectl`)
- Helm 3.x
- Docker
- Node.js 20.x and Yarn

### One-Command Deployment
```bash
# Build and push new image
docker build -t rahulbhiwagade122/desishowbiz:latest .
docker push rahulbhiwagade122/desishowbiz:latest

 kubectl get pods -n default --watch
 
# Deploy to Kubernetes
helm upgrade my-desishowbiz-frontend ./charts/desishowbiz-frontend
```

## 📋 Detailed Deployment Process

### 1. Local Development & Testing

#### Start Local Development Server
```bash
cd /path/to/desishowbiz-nextjs-blog
npm run dev
# Access at http://localhost:3000
```

#### Build for Production
```bash
npm run build
npm run serve
# Test production build at http://localhost:3000
```

### 2. Docker Image Management

#### Build New Image
```bash
# Navigate to project directory
cd c:\Users\Dell\Documents\google-cloud\desishowbiz-nextjs-blog

# Build Docker image
docker build -t rahulbhiwagade122/desishowbiz:latest .

# Tag for version tracking (optional)
docker tag rahulbhiwagade122/desishowbiz:latest rahulbhiwagade122/desishowbiz:v1.0.x
```

#### Push to Registry
```bash
# Push latest image
docker push rahulbhiwagade122/desishowbiz:latest

# Push versioned image
docker push rahulbhiwagade122/desishowbiz:v1.0.x
```

### 3. Kubernetes Deployment

#### Deploy with Helm
```bash
# Deploy/upgrade the application
helm upgrade my-desishowbiz-frontend ./charts/desishowbiz-frontend

# Verify deployment
kubectl get pods -n default
kubectl get services -n default
kubectl get ingress -n default
```

#### Check Application Logs
```bash
# Get pod name
kubectl get pods -n default

# View logs
kubectl logs <pod-name> -n default
```

#### Port Forward for Testing (if needed)
```bash
# Forward local port to service
kubectl port-forward service/my-desishowbiz-frontend-service 3000:3000 -n default

# Access at http://localhost:3000
```

### 4. Configuration Files

#### Key Configuration Files:
- `charts/desishowbiz-frontend/values.yaml` - Main deployment configuration
- `charts/desishowbiz-frontend/Chart.yaml` - Helm chart metadata
- `Dockerfile` - Container configuration
- `next.config.js` - Next.js configuration

#### Critical Environment Variables:
```yaml
env:
  NODE_ENV: production
  NEXT_TELEMETRY_DISABLED: "1"
  PORT: "3000"  # CRITICAL: Must match service targetPort
```

#### Service Configuration:
```yaml
service:
  type: ClusterIP
  port: 3000
  targetPort: 3000  # Must match container PORT
```

## 🔧 Troubleshooting Common Issues

### Issue 1: 503 Service Unavailable
**Symptoms**: Website returns 503 error
**Root Cause**: Port mismatch between Kubernetes service and application

**Solution**:
1. Ensure `PORT: "3000"` is set in `values.yaml`
2. Ensure `targetPort: 3000` matches service port
3. Verify ingress points to correct service port
4. Check pod logs: `kubectl logs <pod-name>`

**Fix Ingress Port**:
```bash
kubectl patch ingress ingress-desishowbiz -n default --type='json' -p='[{"op": "replace", "path": "/spec/rules/0/http/paths/0/backend/service/port/number", "value": 3000}]'
```

### Issue 2: MDX Build Errors
**Symptoms**: Build fails with "Unexpected closing tag" or "Expected closing tag"

**Solution**:
1. Check for missing closing tags in `.mdx` files
2. Verify all HTML/MDX tags are properly closed
3. Common issues:
   - Missing `</div>` tags
   - Malformed image grid structures
   - Incorrect YouTube component syntax

**YouTube Component Fix**:
```mdx
<!-- ❌ Wrong -->
<Youtube url="..."></Youtube>

<!-- ✅ Correct -->
<YouTube url="https://www.youtube.com/watch?v=VIDEO_ID" />
```

### Issue 3: RelatedPosts Links Not Working
**Symptoms**: "Read more" links lead to wrong URLs

**Solution**:
Ensure all links in `components/RelatedPosts.tsx` use `/blog/` prefix:
```tsx
// ✅ Correct
href={`/blog/${post.slug}`}

// ❌ Wrong
href={`/${post.slug}`}
```

### Issue 4: Pod Not Starting
**Symptoms**: Pod stuck in `Pending` or `Error` state

**Solution**:
```bash
# Check pod status
kubectl get pods -n default

# Check pod events
kubectl describe pod <pod-name> -n default

# Check logs
kubectl logs <pod-name> -n default

# Common fixes:
kubectl delete pod <pod-name> -n default  # Force restart
```

### Issue 5: Content Not Updating
**Symptoms**: New blog posts not appearing

**Solution**:
1. Rebuild and push new Docker image
2. Restart deployment: `kubectl rollout restart deployment/my-desishowbiz-frontend`
3. Clear Next.js cache if needed

## 📝 Content Management

### Adding New Blog Posts
1. Create new `.mdx` file in `data/blog/`
2. Follow existing format with frontmatter:
```mdx
---
title: Your Blog Title
date: 'YYYY-MM-DD'
tags: ['tag1', 'tag2']
draft: false
layout: PostBanner
images: ['/static/images/path/to/image.jpg']
summary: Brief description
---
```

### Required Frontmatter Fields:
- `title`: Post title
- `date`: Publication date (YYYY-MM-DD)
- `tags`: Array of relevant tags
- `draft`: Set to `false` for published posts
- `layout`: Usually `PostBanner`
- `images`: Array of image paths
- `summary`: Short description

### Image Requirements:
- Place images in `public/static/images/`
- Use `.webp`, `.jpg`, or `.avif` formats
- Optimize images for web (recommended: <500KB each)

## 🔍 Monitoring & Health Checks

### Check Application Health:
```bash
# Pod status
kubectl get pods -n default

# Service endpoints
kubectl get endpoints -n default

# Ingress status
kubectl describe ingress ingress-desishowbiz -n default
```

### View Application Logs:
```bash
# All pods
kubectl logs -l app=my-desishowbiz-frontend -n default --tail=50

# Specific pod
kubectl logs <pod-name> -n default -f
```

### Debug Port Issues:
```bash
# Check if port 3000 is listening inside pod
kubectl exec <pod-name> -n default -- netstat -tlnp | grep 3000

# Check environment variables
kubectl exec <pod-name> -n default -- env | grep PORT
```

## 🚀 Advanced Deployment

### Rollback Deployment:
```bash
# Check revision history
helm history my-desishowbiz-frontend

# Rollback to previous version
helm rollback my-desishowbiz-frontend <revision-number>
```

### Zero-Downtime Updates:
```bash
# Update image tag in values.yaml
# Then deploy
helm upgrade my-desishowbiz-frontend ./charts/desishowbiz-frontend
```

### Scale Deployment:
```bash
# Scale to multiple replicas
kubectl scale deployment my-desishowbiz-frontend --replicas=3

# Check scaling
kubectl get deployment my-desishowbiz-frontend
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks:
1. **Weekly**: Check pod health and restart if needed
2. **Monthly**: Update dependencies and rebuild image
3. **Quarterly**: Review and optimize Kubernetes resources

### Emergency Contacts:
- **Development**: Local development server
- **Production Issues**: Check GKE console and Cloud Logging
- **Build Issues**: Review GitHub Actions logs

### Performance Monitoring:
- Monitor pod resource usage: `kubectl top pods`
- Check ingress traffic patterns
- Monitor application response times

---

**Last Updated**: September 28, 2025
**Version**: 1.0.0
**Application**: Next.js 15.2.4
**Kubernetes**: GKE with nginx ingress

For questions or issues, refer to the troubleshooting section above or check the application logs for detailed error messages.

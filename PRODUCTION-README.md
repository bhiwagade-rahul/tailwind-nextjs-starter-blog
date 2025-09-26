# Production Deployment Guide

This guide provides instructions for deploying the Desi Show Biz blog to production using Docker.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Domain name (optional, for SSL configuration)

### Basic Deployment

1. **Clone and setup the project:**
   ```bash
   git clone <your-repo-url>
   cd desishowbiz-nextjs-blog
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.production .env.local
   # Edit .env.local with your production values
   ```

3. **Build and deploy:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

4. **Check deployment:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

## 📁 Production Files Overview

### Core Files
- `Dockerfile.prod` - Multi-stage production Dockerfile
- `docker-compose.prod.yml` - Production orchestration
- `.dockerignore.prod` - Build context optimization
- `.env.production` - Production environment template

### Logs
- `logs/` - Application logs

## 🔧 Configuration

### Environment Variables

Copy `.env.production` to `.env.local` and configure:

```bash
# Required
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NODE_ENV=production

# Optional (uncomment and configure as needed)
# GOOGLE_ANALYTICS_ID=your_ga_id
# DATABASE_URL=your_database_connection_string
# SMTP_HOST=smtp.yourprovider.com
```

### SSL Configuration

For SSL configuration, you can use a reverse proxy like nginx or a cloud load balancer:

1. **Update the base URL in `.env.local`:**
   ```bash
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```

2. **Configure your reverse proxy or load balancer** to handle SSL termination and forward requests to the container on port 3000.

## 🐳 Docker Commands

### Build and Deploy
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# Build without cache
docker-compose -f docker-compose.prod.yml build --no-cache

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Monitoring and Logs
```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View application logs
docker-compose -f docker-compose.prod.yml logs -f desishowbiz-frontend

# View last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Maintenance
```bash
# Restart services
docker-compose -f docker-compose.prod.yml restart

# Rebuild specific service
docker-compose -f docker-compose.prod.yml build desishowbiz-frontend
docker-compose -f docker-compose.prod.yml up -d desishowbiz-frontend

# Clean up
docker-compose -f docker-compose.prod.yml down -v --remove-orphans
docker system prune -f
```

## 🔍 Health Checks

The deployment includes built-in health checks:

- **Application Health:** `http://localhost:3000/api/health`
- **Docker Health:** Configured in docker-compose.yml

Check health status:
```bash
docker-compose -f docker-compose.prod.yml ps
curl http://localhost:3000/api/health
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Fails
```bash
# Check build logs
docker-compose -f docker-compose.prod.yml logs -f desishowbiz-frontend

# Rebuild with no cache
docker-compose -f docker-compose.prod.yml build --no-cache desishowbiz-frontend
```

#### 2. Application Won't Start
```bash
# Check application logs
docker-compose -f docker-compose.prod.yml logs desishowbiz-frontend

# Check if port 3000 is available
netstat -tlnp | grep :3000
```

#### 3. Port/Connection Issues
```bash
# Check if port 3000 is available
netstat -tlnp | grep :3000

# Test application connectivity
curl -f http://localhost:3000/api/health || echo "Application not responding"
```

#### 4. SSL Certificate Issues
```bash
# Test SSL configuration (if using a reverse proxy)
curl -I https://yourdomain.com

# Check reverse proxy logs if applicable
# docker-compose -f docker-compose.prod.yml logs <reverse-proxy-service>
```

### Debug Mode

Enable debug logging by modifying `docker-compose.prod.yml`:

```yaml
services:
  desishowbiz-frontend:
    environment:
      - LOG_LEVEL=debug
```

## 🔒 Security Considerations

### Best Practices

1. **Use non-root user:** ✅ (configured in Dockerfile)
2. **Minimal attack surface:** ✅ (multi-stage build)
3. **HTTPS only:** ✅ (configure with reverse proxy)
4. **Environment isolation:** ✅ (production environment variables)

### Additional Security Measures

1. **Firewall Configuration:**
   ```bash
   # Allow only necessary ports
   ufw allow 3000  # Application port
   ufw allow ssh    # if needed
   ```

2. **Fail2Ban Setup:**
   ```bash
   # Install and configure fail2ban for intrusion prevention
   apt-get install fail2ban
   ```

3. **Regular Updates:**
   ```bash
   # Update Docker images regularly
   docker-compose -f docker-compose.prod.yml pull
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 📊 Monitoring and Analytics

### Application Metrics

- **Health Endpoint:** `/api/health`
- **Metrics:** Configure monitoring tools like Prometheus
- **Logs:** Centralized logging with ELK stack

### Performance Monitoring

1. **Nginx Metrics:**
   ```bash
   # Enable nginx status module
   curl http://localhost:80/nginx_status
   ```

2. **Docker Stats:**
   ```bash
   docker stats
   ```

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /path/to/desishowbiz-nextjs-blog
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d --build
```

## 📞 Support

For issues and questions:

1. Check the troubleshooting section above
2. Review application and nginx logs
3. Test health endpoints
4. Verify environment configuration

## 🔄 Updates and Maintenance

### Regular Maintenance

1. **Update Dependencies:**
   ```bash
   docker-compose -f docker-compose.prod.yml exec desishowbiz-frontend yarn upgrade
   ```

2. **Database Backups:**
   ```bash
   # If using a database, implement backup strategy
   docker-compose -f docker-compose.prod.yml exec db pg_dump > backup.sql
   ```

3. **Log Rotation:**
   ```bash
   # Configure logrotate for log files
   nano /etc/logrotate.d/desishowbiz
   ```

---

**Note:** Always test deployments in a staging environment before production updates.

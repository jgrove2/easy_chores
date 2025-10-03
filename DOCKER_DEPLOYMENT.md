# Docker Deployment Guide

This guide will help you deploy your Easy Chores application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- Environment variables configured

## Quick Start

### 1. Set Up Environment Variables

Create a `.env` file in your project root:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 2. Build and Run

```bash
# Build the Docker image
docker build -t easy-chores .

# Run with Docker Compose
docker-compose up -d

# Or run directly with Docker
docker run -d \
  --name easy-chores-app \
  -p 3000:3000 \
  --env-file .env \
  easy-chores
```

### 3. Check Application Status

```bash
# Check if the container is running
docker ps

# View logs
docker logs easy-chores-app

# Check health endpoint
curl http://localhost:3000/api/health
```

## Docker Commands

### Basic Commands

```bash
# Build the image
docker build -t easy-chores .

# Run the container
docker run -d --name easy-chores-app -p 3000:3000 --env-file .env easy-chores

# Stop the container
docker stop easy-chores-app

# Remove the container
docker rm easy-chores-app

# View logs
docker logs easy-chores-app

# Execute commands in the container
docker exec -it easy-chores-app sh
```

### Docker Compose Commands

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up --build -d

# Scale the application (if needed)
docker-compose up --scale app=3 -d
```

## Production Deployment

### 1. Environment Configuration

For production, update your environment variables:

```env
NEXTAUTH_URL="https://your-domain.com"
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 2. Set Up Database

Before running the container, set up your database:

```bash
# Run database migrations
npx prisma migrate deploy

# Seed the database
npm run db:seed
```

### 3. Deploy with Docker

```bash
# Build for production
docker build -t easy-chores:latest .

# Run in production
docker run -d \
  --name easy-chores-prod \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  easy-chores:latest
```

## Docker Compose for Production

Create a `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: easy_chores_prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - DIRECT_URL=${DIRECT_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Then run:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

1. **Container won't start:**
   ```bash
   # Check logs
   docker logs easy-chores-app
   
   # Check if port is already in use
   lsof -i :3000
   ```

2. **Database connection issues:**
   - Verify your DATABASE_URL is correct
   - Check if your Supabase project is active
   - Ensure network connectivity

3. **Environment variables not loading:**
   - Make sure `.env` file exists in project root
   - Check file permissions
   - Verify variable names match exactly

4. **Build failures:**
   ```bash
   # Clean build
   docker build --no-cache -t easy-chores .
   
   # Check for syntax errors
   docker build --progress=plain -t easy-chores .
   ```

### Useful Commands

```bash
# Check container status
docker ps -a

# View resource usage
docker stats easy-chores-app

# Access container shell
docker exec -it easy-chores-app sh

# Copy files from container
docker cp easy-chores-app:/app/logs ./logs

# Monitor logs in real-time
docker logs -f easy-chores-app
```

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files to version control
   - Use Docker secrets for sensitive data in production
   - Rotate secrets regularly

2. **Network Security:**
   - Use reverse proxy (nginx) in production
   - Enable HTTPS
   - Configure firewall rules

3. **Container Security:**
   - Run as non-root user (already configured)
   - Keep base images updated
   - Scan for vulnerabilities

## Scaling

For high-traffic deployments:

```yaml
# docker-compose.scale.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000-3002:3000"
    environment:
      - NODE_ENV=production
      # ... other environment variables
    deploy:
      replicas: 3
```

Run with: `docker-compose -f docker-compose.scale.yml up -d`

## Monitoring

Add monitoring to your deployment:

```bash
# Install monitoring tools
docker run -d --name prometheus -p 9090:9090 prom/prometheus
docker run -d --name grafana -p 3001:3000 grafana/grafana

# Monitor your application
curl http://localhost:3000/api/health
```

This setup provides a robust, scalable deployment for your Easy Chores application!

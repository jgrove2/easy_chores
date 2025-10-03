# Database Setup Guide

This application supports both SQLite (development) and PostgreSQL (production).

## Development Setup (SQLite)

For local development, the application uses SQLite by default:

1. **Set up environment variables:**
   ```bash
   # Create .env.local file with:
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

2. **Install dependencies and set up database:**
   ```bash
   npm install
   npm run setup
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Production Setup (PostgreSQL)

For production deployment with PostgreSQL:

### Option 1: Local PostgreSQL with Docker

1. **Start PostgreSQL container:**
   ```bash
   npm run docker:up
   ```

2. **Set up environment variables:**
   ```bash
   # Create .env.production file with:
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/easy_chores?schema=public"
   NEXTAUTH_URL="https://your-domain.com"
   NEXTAUTH_SECRET="your-production-secret-key-here"
   ```

3. **Set up production database:**
   ```bash
   npm run db:setup:prod
   ```

4. **Build and start application:**
   ```bash
   npm run build
   npm run start
   ```

### Option 2: Full Docker Deployment

1. **Set up environment variables:**
   ```bash
   # Create .env.production file with your production values
   DATABASE_URL="postgresql://postgres:postgres@postgres:5432/easy_chores?schema=public"
   NEXTAUTH_URL="https://your-domain.com"
   NEXTAUTH_SECRET="your-production-secret-key-here"
   ```

2. **Start all services with Docker:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Available Scripts

- `npm run setup` - Complete development setup
- `npm run db:setup:dev` - Set up development database
- `npm run db:setup:prod` - Set up production database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes (development)
- `npm run db:migrate` - Run migrations (development)
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers
- `npm run docker:logs` - View Docker logs

## Environment Variables

### Required Variables

- `DATABASE_URL` - Database connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Secret key for NextAuth

### Database URLs

- **SQLite (development):** `file:./dev.db`
- **PostgreSQL (production):** `postgresql://username:password@host:port/database?schema=public`

## Switching Between Databases

To switch from SQLite to PostgreSQL:

1. Update `DATABASE_URL` in your environment file
2. Run `npm run db:generate` to regenerate Prisma client
3. Run `npm run db:push` (development) or `npm run db:migrate:deploy` (production)

## Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Check that PostgreSQL container is running: `docker-compose ps`
   - Verify DATABASE_URL format
   - Ensure database exists

2. **Migration errors:**
   - Reset database: `npm run db:reset`
   - Re-run setup: `npm run db:setup:dev` or `npm run db:setup:prod`

3. **Docker issues:**
   - Check logs: `npm run docker:logs`
   - Restart containers: `npm run docker:down && npm run docker:up`

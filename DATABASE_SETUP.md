# Database Setup Guide

This application supports SQLite (development) and Supabase (production).

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

## Production Setup (Supabase)

For production deployment with Supabase:

### Option 1: Supabase Cloud (Recommended)

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Set up environment variables:**
   ```bash
   # Create .env.production file with:
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   NEXTAUTH_URL="https://your-domain.com"
   NEXTAUTH_SECRET="your-production-secret-key-here"
   SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
   SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

3. **Set up production database:**
   ```bash
   npm run db:setup:supabase
   ```

4. **Build and start application:**
   ```bash
   npm run build
   npm run start
   ```

### Option 2: Local Supabase Development

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Start local Supabase:**
   ```bash
   npm run supabase:start
   ```

3. **Set up environment variables:**
   ```bash
   # Use the local Supabase URLs from the status command
   npm run supabase:status
   ```

4. **Set up local database:**
   ```bash
   npm run db:setup:supabase
   ```

## Available Scripts

- `npm run setup` - Complete development setup
- `npm run db:setup:dev` - Set up development database
- `npm run db:setup:supabase` - Set up Supabase database
- `npm run db:setup:prod` - Set up production database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes (development)
- `npm run db:migrate` - Run migrations (development)
- `npm run db:migrate:deploy` - Deploy migrations (production)
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio
- `npm run supabase:start` - Start local Supabase
- `npm run supabase:stop` - Stop local Supabase
- `npm run supabase:status` - Check Supabase status
- `npm run supabase:gen:types` - Generate TypeScript types from Supabase

## Environment Variables

### Required Variables

- `DATABASE_URL` - Database connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Secret key for NextAuth

### Database URLs

- **SQLite (development):** `file:./dev.db`
- **Supabase (production):** `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- **Local Supabase:** `postgresql://postgres:postgres@localhost:54322/postgres`

## Switching Between Databases

To switch from SQLite to Supabase:

1. Update `DATABASE_URL` and `DIRECT_URL` in your environment file
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

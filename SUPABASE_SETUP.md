# Supabase Setup Guide

This guide will help you set up Supabase for your Easy Chores application.

## Prerequisites

- Node.js 18+ installed
- Supabase CLI installed (`npm install -g supabase`)

## Option 1: Supabase Cloud (Recommended for Production)

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `easy-chores`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
6. Click "Create new project"

### 2. Get Your Project Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon/public key**
   - **service_role key**

3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)

### 3. Set Up Environment Variables

Create a `.env.production` file with:

```env
# Database URLs
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth Configuration
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret-key"
```

### 4. Set Up Database Schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Supabase
npm run db:push

# Seed with initial data
npm run db:seed
```

### 5. Deploy Your Application

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Option 2: Local Supabase Development

### 1. Initialize Supabase Locally

```bash
# Initialize Supabase in your project
supabase init

# Start local Supabase services
npm run supabase:start
```

### 2. Get Local Credentials

```bash
# Check status and get connection details
npm run supabase:status
```

This will show you the local database URL and other connection details.

### 3. Set Up Environment Variables

Create a `.env.local` file with the local Supabase URLs:

```env
# Local Supabase Database
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Local Supabase Configuration
SUPABASE_URL="http://localhost:54321"
SUPABASE_ANON_KEY="your-local-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-local-service-role-key"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-local-secret-key"
```

### 4. Set Up Local Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to local Supabase
npm run db:push

# Seed with initial data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

## Supabase Features You Can Use

### 1. Real-time Subscriptions

Supabase provides real-time subscriptions out of the box. You can listen to database changes:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Listen to chore changes
supabase
  .channel('chores')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'chores' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe()
```

### 2. Row Level Security (RLS)

Enable RLS in your Supabase dashboard to secure your data:

```sql
-- Enable RLS on tables
ALTER TABLE chores ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view chores in their groups" ON chores
  FOR SELECT USING (
    group_id IN (
      SELECT group_id FROM group_memberships WHERE user_id = auth.uid()
    )
  );
```

### 3. Database Functions

Create custom database functions in Supabase:

```sql
-- Example: Get user's chores for today
CREATE OR REPLACE FUNCTION get_todays_chores(user_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  frequency TEXT,
  next_due_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.title, c.frequency, c.next_due_date
  FROM chores c
  JOIN group_memberships gm ON c.group_id = gm.group_id
  WHERE gm.user_id = get_todays_chores.user_id
    AND c.is_active = true
    AND (c.next_due_date <= NOW() OR c.next_due_date IS NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Troubleshooting

### Common Issues

1. **Connection refused errors:**
   - Check that Supabase is running: `npm run supabase:status`
   - Verify your DATABASE_URL is correct
   - Ensure your project is not paused (Supabase Cloud)

2. **Schema sync issues:**
   - Reset local database: `npm run supabase:db:reset`
   - Re-run setup: `npm run db:setup:supabase`

3. **Authentication issues:**
   - Verify your SUPABASE_URL and keys are correct
   - Check that your project is not paused
   - Ensure RLS policies are properly configured

### Useful Commands

```bash
# Check Supabase status
npm run supabase:status

# View Supabase logs
supabase logs

# Reset local database
npm run supabase:db:reset

# Generate TypeScript types
npm run supabase:gen:types

# Stop Supabase
npm run supabase:stop
```

## Next Steps

1. **Set up authentication** - Configure OAuth providers in Supabase dashboard
2. **Enable RLS** - Secure your data with row-level security policies
3. **Add real-time features** - Implement real-time updates for chores
4. **Deploy to production** - Use Supabase Cloud for your production deployment

For more information, visit the [Supabase documentation](https://supabase.com/docs).

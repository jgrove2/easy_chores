# Vercel Deployment Guide

This guide will help you deploy your Easy Chores application to Vercel.

## Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- Supabase project set up
- Git repository (GitHub, GitLab, or Bitbucket)

## Quick Deployment

### Option 1: Deploy from Git (Recommended)

1. **Connect your repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Vercel will automatically detect it's a Next.js project

2. **Configure environment variables:**
   - Go to Project Settings → Environment Variables
   - Add the following variables:

   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-production-secret-key
   ```

3. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

## Environment Variables Setup

### Required Variables

Add these to your Vercel project settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase database URL | `postgresql://postgres:password@db.abc123.supabase.co:5432/postgres` |
| `DIRECT_URL` | Direct database URL (same as DATABASE_URL) | `postgresql://postgres:password@db.abc123.supabase.co:5432/postgres` |
| `NEXTAUTH_URL` | Your Vercel app URL | `https://easy-chores.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for NextAuth | `your-secret-key-here` |

### Optional Variables

| Variable | Description | When to Use |
|----------|-------------|-------------|
| `SUPABASE_URL` | Supabase project URL | If using Supabase client features |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | If using Supabase client features |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | If using Supabase admin features |

## Database Setup

### 1. Set Up Supabase Database

Before deploying, set up your database:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Supabase
npm run db:push

# Seed with initial data
npm run db:seed
```

### 2. Run Database Migrations

You can run migrations in several ways:

**Option A: Using Vercel CLI**
```bash
# Install dependencies
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

**Option B: Using Supabase Dashboard**
- Go to your Supabase project
- Navigate to SQL Editor
- Run your migration SQL manually

**Option C: Using GitHub Actions**
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Vercel Configuration

### vercel.json

The `vercel.json` file is already configured with:

- **Build settings** for Next.js
- **Function timeouts** for API routes
- **Environment variables**
- **Regional deployment**

### Custom Domain (Optional)

1. **Add domain in Vercel:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records

2. **Update environment variables:**
   ```
   NEXTAUTH_URL=https://your-domain.com
   ```

## Deployment Workflow

### Automatic Deployments

Vercel automatically deploys when you push to your main branch:

1. **Push to main branch**
2. **Vercel detects changes**
3. **Builds the application**
4. **Deploys to production**

### Preview Deployments

Every pull request gets a preview deployment:

1. **Create pull request**
2. **Vercel creates preview URL**
3. **Test your changes**
4. **Merge when ready**

## Monitoring and Analytics

### Vercel Analytics

Enable analytics in your Vercel dashboard:

1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. View performance metrics

### Health Checks

Your app includes a health check endpoint:

```
GET https://your-app.vercel.app/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Troubleshooting

### Common Issues

1. **Build failures:**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in `package.json`
   - Ensure environment variables are set

2. **Database connection issues:**
   - Verify `DATABASE_URL` is correct
   - Check if Supabase project is active
   - Ensure network connectivity

3. **Environment variables not loading:**
   - Check variable names match exactly
   - Verify they're set for the correct environment
   - Redeploy after adding new variables

### Debug Commands

```bash
# Check Vercel CLI status
vercel --version

# View deployment logs
vercel logs

# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

## Performance Optimization

### Vercel Features

1. **Edge Functions** - For global performance
2. **Image Optimization** - Automatic image optimization
3. **CDN** - Global content delivery
4. **Caching** - Automatic caching strategies

### Next.js Optimizations

Your app is already optimized with:

- **Standalone output** for smaller deployments
- **Prisma client** for efficient database queries
- **API routes** for serverless functions

## Scaling

Vercel automatically handles:

- **Traffic spikes** - Auto-scaling
- **Global distribution** - Edge functions
- **CDN caching** - Static asset delivery
- **Database connections** - Connection pooling

## Security

### Vercel Security Features

- **HTTPS** - Automatic SSL certificates
- **DDoS protection** - Built-in protection
- **Environment variables** - Secure secret management
- **Function isolation** - Secure serverless execution

### Best Practices

1. **Never commit secrets** to Git
2. **Use environment variables** for sensitive data
3. **Enable Vercel security** features
4. **Regular security updates** for dependencies

## Cost Optimization

### Vercel Pricing

- **Hobby plan** - Free for personal projects
- **Pro plan** - $20/month for teams
- **Enterprise** - Custom pricing

### Optimization Tips

1. **Use Edge Functions** for global performance
2. **Optimize images** with Vercel's image optimization
3. **Cache static assets** effectively
4. **Monitor usage** in Vercel dashboard

## Support

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Getting Help

1. **Vercel Dashboard** - Check deployment status
2. **Build Logs** - Review build and deployment logs
3. **Community** - Ask questions in Vercel community
4. **Support** - Contact Vercel support for Pro/Enterprise plans

This setup provides a robust, scalable deployment for your Easy Chores application on Vercel!

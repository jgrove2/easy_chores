#!/bin/bash

echo "🚀 Setting up Easy Chores for local development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up environment variables..."
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "✅ Created .env.local from template"
    echo "⚠️  Please update .env.local with your OAuth credentials"
else
    echo "✅ .env.local already exists"
fi

echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push

echo "🌱 Seeding database with sample data..."
npm run db:seed

echo "🎉 Setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "To view database:"
echo "  npm run db:studio"
echo ""
echo "Don't forget to:"
echo "  1. Update .env.local with your OAuth credentials"
echo "  2. Get OAuth credentials from Google/GitHub developer consoles"

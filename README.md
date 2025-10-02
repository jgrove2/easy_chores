# Easy Chores

A collaborative chores management application built with Next.js 15, featuring group-based chore assignment, rotation, and tracking.

## 🚀 Features

- **Authentication**: Google and GitHub OAuth login via NextAuth.js
- **Group Management**: Create and join groups with unique join codes
- **Chore Management**: Create, assign, and track chores with flexible scheduling
- **Smart Assignment**: Single person or alternating assignment between multiple people
- **Due Date Tracking**: Automatic due date calculation and smart display
- **Mobile-First Design**: Responsive UI with Tailwind CSS

## 🚀 Quick Local Setup (SQLite)

For the fastest local development experience with **zero external dependencies**:

```bash
# 1. Install dependencies
npm install

# 2. Set up environment (creates .env.local)
cp .env.local.example .env.local

# 3. Set up database and seed with sample data
npx prisma generate
npx prisma db push
npm run db:seed

# 4. Start development server
npm run dev
```

**That's it!** No Docker, no PostgreSQL setup needed. The app will run with SQLite locally.

### 🎯 One-Command Setup

Or use the automated setup script:

```bash
# Make setup script executable and run it
chmod +x setup.sh
./setup.sh
```

### Optional: View Database

```bash
npm run db:studio
```

This opens Prisma Studio in your browser where you can view and edit your database.

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/   # NextAuth.js authentication
│   │   ├── groups/               # Group management endpoints
│   │   └── chores/               # Chore management endpoints
│   ├── login/                    # Authentication page
│   ├── home/                     # Chore dashboard
│   ├── chores/                   # Chore management
│   │   └── create/               # Create new chore
│   ├── settings/                 # Group and user settings
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main redirect page
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── navigation/               # Navigation components
│   │   ├── BottomNavigation.tsx
│   │   └── TopBar.tsx
│   └── auth/                     # Authentication components
│       └── LoginForm.tsx
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── useGroup.ts              # Group management hook
│   └── useChores.ts             # Chore management hook
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth.js configuration
│   └── database.ts               # Database models and utilities
└── utils/                        # Utility functions
    ├── dateUtils.ts              # Date formatting and calculations
    └── validation.ts             # Form validation utilities
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: SQLite (local) / PostgreSQL (production)
- **ORM**: Prisma

## 🔧 Development

### Database Schema
The application uses SQLite locally with the following main entities:
- **Users**: Authentication and profile data
- **Groups**: Chore groups with join codes
- **Chores**: Chore definitions with frequency and assignment
- **Assignments**: User-to-chore assignments
- **Completions**: Chore completion history

### API Endpoints
- `GET/POST /api/groups` - Group management
- `GET/POST /api/chores` - Chore management
- `POST /api/chores/[id]/complete` - Mark chore as complete

### Component Architecture
- **Page Components**: Located in `src/app/` with `page.tsx` naming
- **UI Components**: Reusable components in `src/components/ui/`
- **Feature Components**: Domain-specific components in `src/components/`
- **Custom Hooks**: Shared logic in `src/hooks/`

## 🚀 Production Setup (PostgreSQL)

For production, simply change the `DATABASE_URL` in your environment to use PostgreSQL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/easy_chores"
```

Then run:
```bash
npx prisma migrate deploy
```

## 📱 Application Flow

### User Journey
1. **Login** → OAuth authentication with Google/GitHub
2. **Group Selection** → Join existing group or create new one
3. **Chore Dashboard** → View today's and upcoming chores
4. **Chore Management** → Create, edit, and manage chores
5. **Settings** → Manage group and account settings

### Key Features
- **Group-based Access**: Users must be in a group to access main features
- **Flexible Chore Assignment**: Single person or alternating between multiple people
- **Smart Due Dates**: Automatic calculation based on frequency and completion
- **Mobile-First Design**: Optimized for mobile devices with bottom navigation

## 🎯 Benefits of This Setup

✅ **Zero Dependencies** - No Docker, no PostgreSQL setup for local development  
✅ **Instant Start** - Just `npm install && npm run dev`  
✅ **Sample Data** - Pre-populated with example chores  
✅ **Database GUI** - `npm run db:studio` to view/edit data  
✅ **Production Ready** - Easy switch to PostgreSQL for deployment  

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, please open an issue in the repository or contact the development team.
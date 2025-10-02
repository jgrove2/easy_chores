# Easy Chores

A collaborative chores management application built with Next.js 15, featuring group-based chore assignment, rotation, and tracking.

## 🚀 Features

- **Authentication**: Google and GitHub OAuth login via NextAuth.js
- **Group Management**: Create and join groups with unique join codes
- **Chore Management**: Create, assign, and track chores with flexible scheduling
- **Smart Assignment**: Single person or alternating assignment between multiple people
- **Due Date Tracking**: Automatic due date calculation and smart display
- **Mobile-First Design**: Responsive UI with Tailwind CSS

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
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Docker containerization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- Docker (optional, for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd easy_chores
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/easy_chores"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. **Set up the database**
   ```bash
   # Using Docker (recommended)
   docker-compose up -d
   
   # Or set up PostgreSQL manually
   # Then run Prisma migrations
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

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

## 🔧 Development

### Database Schema
The application uses PostgreSQL with the following main entities:
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

## 🚀 Deployment

### Docker Deployment
```bash
# Build the application
docker build -t easy-chores .

# Run with docker-compose
docker-compose up -d
```

### Environment Variables
Ensure all required environment variables are set in production:
- Database connection string
- NextAuth.js configuration
- OAuth provider credentials

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
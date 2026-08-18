# PlanIt - Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or use Docker)
- Docker & Docker Compose (optional)

## Quick Start with Docker

The easiest way to get started is using Docker Compose:

```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Start all services
docker-compose up

# In another terminal, setup database
docker-compose exec backend npm run prisma:push
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

## Manual Setup (Development)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update DATABASE_URL in .env
export DATABASE_URL="postgresql://user:password@localhost:5432/planit"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The backend will run on http://localhost:3001

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.local.example .env.local

# Start development server
npm run dev
```

The frontend will run on http://localhost:3000

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/planit
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Database Setup

### Using Docker PostgreSQL

```bash
docker run --name planit-db \
  -e POSTGRES_USER=planit \
  -e POSTGRES_PASSWORD=planit_password_123 \
  -e POSTGRES_DB=planit \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Create Database Tables

```bash
cd backend
npm run prisma:push
```

## Project Structure

```
planIt/
├── backend/
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth & error handling
│   │   ├── utils/         # Helper functions
│   │   └── index.ts       # Main app file
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/              # Utilities & API client
│   ├── public/           # Static assets
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/profile-switch` - Switch profile

### Profiles
- `GET /api/v1/profiles` - List all profiles
- `POST /api/v1/profiles` - Create new profile
- `GET /api/v1/profiles/:id` - Get profile details
- `PATCH /api/v1/profiles/:id` - Update profile
- `DELETE /api/v1/profiles/:id` - Delete profile

### Todos
- `GET /api/v1/todo` - List todos
- `POST /api/v1/todo` - Create todo
- `GET /api/v1/todo/:id` - Get todo details
- `PATCH /api/v1/todo/:id` - Update todo
- `DELETE /api/v1/todo/:id` - Delete todo

### Events
- `GET /api/v1/events` - List events
- `POST /api/v1/events` - Create event
- `GET /api/v1/events/:id` - Get event details
- `PATCH /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event

### Chores
- `GET /api/v1/chores` - List chores
- `POST /api/v1/chores` - Create chore
- `GET /api/v1/chores/:id` - Get chore details
- `PATCH /api/v1/chores/:id` - Update chore
- `DELETE /api/v1/chores/:id` - Delete chore

### Exams
- `GET /api/v1/exams` - List exams
- `POST /api/v1/exams` - Create exam
- `GET /api/v1/exams/:id` - Get exam details
- `PATCH /api/v1/exams/:id` - Update exam
- `DELETE /api/v1/exams/:id` - Delete exam

### Olympiad
- `GET /api/v1/olympiad` - List olympiad preps
- `POST /api/v1/olympiad` - Create olympiad prep
- `GET /api/v1/olympiad/:id` - Get olympiad prep details
- `PATCH /api/v1/olympiad/:id` - Update olympiad prep
- `DELETE /api/v1/olympiad/:id` - Delete olympiad prep

### Homework
- `GET /api/v1/homework` - List homework
- `POST /api/v1/homework` - Create homework
- `GET /api/v1/homework/:id` - Get homework details
- `PATCH /api/v1/homework/:id` - Update homework
- `DELETE /api/v1/homework/:id` - Delete homework

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Connection Issues

- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists
- Check user permissions

### Docker Issues

```bash
# Clean up Docker containers
docker-compose down -v

# Rebuild containers
docker-compose up --build
```

## Production Deployment

1. Update JWT_SECRET and environment variables
2. Set NODE_ENV=production
3. Build frontend: `npm run build`
4. Build backend: `npm run build`
5. Use production database
6. Set secure cookie flags
7. Enable HTTPS
8. Configure CORS properly

## Support

For issues or questions, check the project documentation or create an issue.

# PlanIt - Family Planner Application

A centralized, intuitive web application for managing both individual and shared family schedules.

## Project Structure

```
planIt/
├── frontend/          # Next.js React TypeScript application
├── backend/           # Node.js Express API server
├── docker-compose.yml # Docker orchestration
├── .env.example       # Environment variables template
└── README.md
```

## Features

- **Family Unit Management**: Multiple profiles per household with role-based access
- **ToDo Management**: Create, edit, and track personal tasks
- **Event Tracking**: Log family events with date/time/location
- **Chores Management**: Assign and track household chores
- **Exam Planner**: Parents can log and track exam schedules
- **Homework Tracker**: Kids can organize and track homework by subject
- **Revision Planner**: Track study progress for exams
- **Olympiad Planner**: Plan competitive exam preparation

## Tech Stack

- **Frontend**: Next.js 14+, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with HTTP-Only cookies, Session PIN

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Development Setup

1. **Clone and setup**
   ```bash
   npm run setup
   ```

2. **Start development servers**
   ```bash
   npm run dev
   ```

3. **With Docker**
   ```bash
   docker-compose up
   ```

## API Documentation

See `backend/README.md` for detailed API endpoints.

## Database Schema

See `backend/prisma/schema.prisma` for the complete data model.

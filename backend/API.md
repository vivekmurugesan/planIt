# PlanIt API Documentation

Base URL: `http://localhost:3001/api/v1`

## Authentication

All authenticated endpoints require a valid JWT token in the `accessToken` cookie.

### Register

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "accountType": "FAMILY" // or "SINGLE"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "accountType": "FAMILY"
  }
}
```

### Login

**POST** `/auth/login`

Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "accountType": "FAMILY"
  }
}
```

Sets `accessToken` and `refreshToken` cookies automatically.

### Logout

**POST** `/auth/logout`

Clear authentication tokens.

**Response:**
```json
{
  "message": "Logged out"
}
```

### Refresh Token

**POST** `/auth/refresh`

Get a new access token using refresh token.

**Response:**
```json
{
  "message": "Token refreshed"
}
```

### Profile Switch

**POST** `/auth/profile-switch`

Switch to a different profile.

**Request Body:**
```json
{
  "profileId": "profile_id"
}
```

**Response:**
```json
{
  "profile": {
    "id": "profile_id",
    "displayName": "Mom",
    "avatar": "👩",
    "relationship": "PARENT"
  }
}
```

## Profiles

### List Profiles

**GET** `/profiles`

Get all profiles for the logged-in user.

**Response:**
```json
{
  "profiles": [
    {
      "id": "profile_id",
      "displayName": "Mom",
      "avatar": "👩",
      "relationship": "PARENT",
      "colorCode": "#4CAF50",
      "age": 40
    }
  ]
}
```

### Create Profile

**POST** `/profiles`

Create a new profile.

**Request Body:**
```json
{
  "displayName": "Alex",
  "relationship": "CHILD",
  "avatar": "👦",
  "colorCode": "#2196F3",
  "age": 12
}
```

**Response:**
```json
{
  "profile": {
    "id": "new_profile_id",
    "displayName": "Alex",
    "avatar": "👦",
    "relationship": "CHILD",
    "colorCode": "#2196F3",
    "age": 12
  }
}
```

### Get Profile

**GET** `/profiles/:id`

Get details of a specific profile.

**Response:**
```json
{
  "profile": {
    "id": "profile_id",
    "displayName": "Alex",
    "avatar": "👦",
    "relationship": "CHILD"
  }
}
```

### Update Profile

**PATCH** `/profiles/:id`

Update profile information.

**Request Body:**
```json
{
  "displayName": "Alexander",
  "colorCode": "#FF9800"
}
```

### Delete Profile

**DELETE** `/profiles/:id`

Delete a profile.

## Todo

### List Todos

**GET** `/todo?profileId=profile_id`

Get all todos (optionally filtered by profile).

**Query Parameters:**
- `profileId` (optional): Filter by profile ID

**Response:**
```json
{
  "todos": [
    {
      "id": "todo_id",
      "title": "Complete homework",
      "description": "Math chapter 5",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2024-08-25T18:00:00Z"
    }
  ]
}
```

### Create Todo

**POST** `/todo`

Create a new todo.

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "priority": "MEDIUM",
  "profileId": "profile_id",
  "dueDate": "2024-08-25T18:00:00Z"
}
```

### Update Todo

**PATCH** `/todo/:id`

Update todo status or details.

**Request Body:**
```json
{
  "status": "COMPLETED",
  "priority": "HIGH"
}
```

### Delete Todo

**DELETE** `/todo/:id`

Delete a todo.

## Events

### List Events

**GET** `/events?profileId=profile_id`

Get all events.

**Response:**
```json
{
  "events": [
    {
      "id": "event_id",
      "title": "School outing",
      "description": "Field trip to museum",
      "location": "City Museum",
      "eventType": "SCHOOL_EVENT",
      "startDate": "2024-08-25T09:00:00Z",
      "endDate": "2024-08-25T17:00:00Z"
    }
  ]
}
```

### Create Event

**POST** `/events`

Create a new event.

**Request Body:**
```json
{
  "title": "Birthday party",
  "description": "Alex's birthday",
  "location": "Home",
  "eventType": "OTHER",
  "startDate": "2024-09-15T18:00:00Z",
  "profileId": "profile_id"
}
```

### Update Event

**PATCH** `/events/:id`

Update event details.

### Delete Event

**DELETE** `/events/:id`

Delete an event.

## Chores

### List Chores

**GET** `/chores?profileId=profile_id`

Get all chores.

**Response:**
```json
{
  "chores": [
    {
      "id": "chore_id",
      "title": "Wash dishes",
      "description": "After dinner",
      "status": "NOT_STARTED",
      "recurring": true,
      "frequency": "DAILY"
    }
  ]
}
```

### Create Chore

**POST** `/chores`

Create a new chore.

**Request Body:**
```json
{
  "title": "Clean bedroom",
  "description": "Tidy up and organize",
  "recurring": false,
  "profileId": "profile_id"
}
```

### Update Chore

**PATCH** `/chores/:id`

Update chore status.

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

### Delete Chore

**DELETE** `/chores/:id`

Delete a chore.

## Exams

### List Exams

**GET** `/exams?profileId=profile_id`

Get all exam schedules.

**Response:**
```json
{
  "exams": [
    {
      "id": "exam_id",
      "subject": "Mathematics",
      "topic": "Algebra",
      "testDate": "2024-09-20T10:00:00Z",
      "status": "IN_PROGRESS"
    }
  ]
}
```

### Create Exam

**POST** `/exams`

Create exam schedule.

**Request Body:**
```json
{
  "subject": "English",
  "topic": "Shakespeare",
  "testDate": "2024-09-15T14:00:00Z",
  "profileId": "profile_id"
}
```

### Update Exam

**PATCH** `/exams/:id`

Update exam status.

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

### Delete Exam

**DELETE** `/exams/:id`

Delete an exam schedule.

## Olympiad

### List Olympiad Preps

**GET** `/olympiad?profileId=profile_id`

Get all olympiad preparations.

**Response:**
```json
{
  "olympiads": [
    {
      "id": "olympiad_id",
      "subject": "Mathematics",
      "topic": "Geometry",
      "prepDate": "2024-10-01T16:00:00Z",
      "status": "NOT_STARTED"
    }
  ]
}
```

### Create Olympiad Prep

**POST** `/olympiad`

Create olympiad preparation schedule.

**Request Body:**
```json
{
  "subject": "Science",
  "topic": "Physics",
  "prepDate": "2024-09-25T15:00:00Z",
  "profileId": "profile_id"
}
```

### Update Olympiad

**PATCH** `/olympiad/:id`

Update olympiad status.

### Delete Olympiad

**DELETE** `/olympiad/:id`

Delete olympiad preparation.

## Homework

### List Homework

**GET** `/homework?profileId=profile_id&subject=Math`

Get all homework.

**Query Parameters:**
- `profileId` (optional): Filter by profile
- `subject` (optional): Filter by subject

**Response:**
```json
{
  "homework": [
    {
      "id": "homework_id",
      "subject": "Mathematics",
      "title": "Algebra exercises",
      "description": "Pages 50-60",
      "dueDate": "2024-08-25T23:59:00Z",
      "status": "IN_PROGRESS",
      "priority": "HIGH"
    }
  ]
}
```

### Create Homework

**POST** `/homework`

Create homework assignment.

**Request Body:**
```json
{
  "subject": "Physics",
  "title": "Lab report",
  "description": "Pendulum experiment",
  "dueDate": "2024-08-28T23:59:00Z",
  "priority": "MEDIUM",
  "profileId": "profile_id"
}
```

### Update Homework

**PATCH** `/homework/:id`

Update homework status.

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

### Delete Homework

**DELETE** `/homework/:id`

Delete homework assignment.

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

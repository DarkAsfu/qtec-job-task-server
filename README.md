
# Job Board Backend

A Node.js + Express.js backend for a job board with MongoDB.

## Features
- Jobs: List, get, create (admin), delete (admin)
- Applications: Submit job application
- Admin: Register and login with JWT authentication
- Input validation for required fields, email, and resume URL

## Endpoints

### Admin
- `POST /api/admin/register` – Register a new admin (role: admin)
- `POST /api/admin/login` – Login as admin (returns JWT token)

### Jobs
- `GET /api/jobs` – List all jobs
- `GET /api/jobs/{id}` – Get single job details
- `POST /api/jobs` – Create a job (Admin, JWT required)
- `DELETE /api/jobs/{id}` – Delete a job (Admin, JWT required)

### Applications
- `POST /api/applications` – Submit job application

## Models
- **Admin**: id, username, password (hashed), role (admin), created_at
- **Job**: id, title, company, location, category, description, created_at
- **Application**: id, job_id, name, email, resume_link, cover_note, created_at

## Setup
1. Install dependencies: `npm install`
2. Set up MongoDB and update `.env` if needed
3. Start server: `node index.js`

## Environment Variables
- `PORT` (default: 5000)
- `MONGO_URI` (your MongoDB connection string)
- `JWT_SECRET` (secret for JWT tokens, optional but recommended)

## Authentication
- Admin endpoints require JWT authentication. Use the token returned from `/api/admin/login` in the `Authorization: Bearer <token>` header for protected routes.

## Notes
- Only users with role `admin` can register/login as admin.
- For production, secure admin endpoints, use HTTPS, and validate inputs further.

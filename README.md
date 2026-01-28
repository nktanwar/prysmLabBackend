# Mini CRM Backend

A production-style backend service built with **NestJS**, **PostgreSQL**, and **Prisma ORM**, implementing secure authentication, role-based authorization, and CRUD APIs for users, customers, and tasks.

This project was built as part of the **Prysm Labs – Backend Developer Intern Assignment**.

---

## 🚀 Tech Stack

- **NestJS** (TypeScript)
- **PostgreSQL**
- **Prisma ORM**
- **JWT Authentication**
- **Role-Based Access Control (RBAC)**
- **Swagger API Documentation**
- **Docker** (for deployment)

---

## 🧩 Core Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Secure password hashing using bcrypt
- Role-based access control
- Roles supported:
  - `ADMIN`
  - `EMPLOYEE`

### 👥 Users Module (ADMIN only)
- View all users
- View user by ID
- Update user role

### 🧑‍💼 Customers Module
- Create, read, update, delete customers
- Pagination support
- Unique constraints on email and phone
- Role rules:
  - ADMIN: full access
  - EMPLOYEE: read-only

### 🧾 Tasks Module
- Create tasks and assign them to EMPLOYEEs
- Tasks linked to customers
- Task status management
- Role rules:
  - ADMIN: view all tasks, create tasks, update any task
  - EMPLOYEE: view only assigned tasks, update own task status

---
## Setup Instructions (Local)

1. Clone the repository
```bash
git clone <https://github.com/nktanwar/prysmLabBackend.git>
cd mini-crm-backend
```

2. Install dependencies

```bash
npm install
```

3. Environment variables

```bash
cp .env.example .env
```
Update values as needed.

4. Database setup
Ensure PostgreSQL is running, then run:
```bash
npx prisma db push
```

5. Start the server
```bash
npm run start:dev
```

Server will run on:
http://localhost:3000

## Swagger API Documentation

Swagger is available at:
http://localhost:3000/api

How to authorize in Swagger:
- Login using /auth/login
- Copy the accessToken
- Click Authorize (lock icon)
- Paste token as:
Bearer <your_token>

## Demo Credentials (For Testing)

These are demo/testing credentials only.

ADMIN
Email: admin@test.com
Password: password123

EMPLOYEE
Email: employee2@test.com
Password: password123

## Sample Curl Commands

Register User
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "password123",
  "role": "ADMIN"
}'
```
Login
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@test.com",
  "password": "password123"
}'
```

Create Customer (ADMIN)
```bash
curl -X POST http://localhost:3000/customers \
-H "Authorization: Bearer <ADMIN_TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "9999999999"
}'
```

## Architecture Overview
- Controllers: HTTP request handling
- Services: business logic
- DTOs: validation and request contracts
- Guards: authentication and role-based authorization
- Prisma: database access layer

Clean modular structure following NestJS best practices.

## Docker & Deployment
Docker support is included.
Render deployment URL will be added here:
Deployment URL: <TO_BE_UPDATED>

## Notes
- Proper HTTP status codes are used: 400, 401, 403, 404, 409
- Passwords are never returned in API responses
- JWT payload includes user ID and role

## Author
Built by Pankaj Rana
Backend Developer Intern Candidate
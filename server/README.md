# HomeSure Backend API

This is the backend for the HomeSure Insurance Policy Administration System.

## Project Structure
```text
server/
├── config/        # Configuration files (Database, etc.)
├── controllers/   # HTTP request handlers
├── middleware/    # Express middleware (Auth, Error Handling)
├── models/        # Sequelize models (Database mapping)
├── routes/        # API route definitions
├── services/      # Business logic and calculations
├── utils/         # Helper functions
├── validators/    # Request payload validators
├── app.js         # Express app initialization
├── server.js      # Server entry point
├── .env           # Environment variables
└── package.json   # Dependencies and scripts
```

## Setup Instructions

1. **Install dependencies:**
   Make sure you are in the `server` directory and run:
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` (already done by the setup):
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your actual MySQL database credentials. Ensure the database `homesure_db` exists.

3. **Start the Server:**
   For development (auto-restarts on changes):
   ```bash
   npm run dev
   ```
   For production:
   ```bash
   npm start
   ```

## Testing the API

To verify that the server is running correctly, you can hit the health-check endpoint.

**Test GET /api/health:**
Use a tool like Postman, curl, or simply your browser to navigate to:
```
http://localhost:5000/api/health
```

Expected Response:
```json
{
  "success": true,
  "message": "HomeSure API is running"
}
```

## Authentication & Authorization

This project uses JWT (JSON Web Tokens) for authentication. 

### Seeding an Agent Account
Since there is no public endpoint to register an AGENT, you can use the seed script:
```bash
node seed_agent.js
```
You can configure the agent credentials by setting `AGENT_EMAIL` and `AGENT_PASSWORD` in your `.env` file, otherwise it defaults to `agent@homesure.com` / `agent123`.

### API Endpoints

#### 1. Customer Registration
`POST /api/auth/register`
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "password": "securepassword"
}
```

#### 2. User Login
`POST /api/auth/login`
**Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### 3. Get Current User (Protected Route)
`GET /api/auth/me`
**Headers:**
`Authorization: Bearer <your_jwt_token>`

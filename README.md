# HomeSure Insurance Policy Administration System

HomeSure is a full-stack web application designed for insurance policy administration. It features a React-based frontend and an Express-based backend with a MySQL database.

## Project Structure

The project is structured as a monorepo containing both the client and server applications:

- `/client`: The frontend React application built with Vite, TypeScript, and React Router.
- `/server`: The backend Express.js REST API with Sequelize ORM for MySQL.

## Prerequisites

- Node.js (v18 or higher recommended)
- MySQL Database

## Getting Started

### 1. Backend Setup (Server)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` (or create a `.env` file) and update your MySQL credentials:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

*See the [Server README](./server/README.md) for more detailed API endpoints and backend instructions, including seeding test data.*

### 2. Frontend Setup (Client)

1. Navigate to the `client` directory (in a new terminal):
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL provided by Vite (typically `http://localhost:5173`).

## Technologies Used

### Frontend
- React
- Vite
- TypeScript
- React Router DOM
- Lucide React (Icons)
- Axios

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL2
- JSON Web Tokens (JWT) for Authentication
- Bcryptjs

# YNT Store

A modern e-commerce application built with Svelte and Node.js.

## Project Structure

- `frontend/` - Svelte frontend application
- `backend/` - Node.js/Express backend API
- `YNT-react-firebase/` - Original React/Firebase implementation (for reference)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   PORT=3001
   JWT_SECRET=your-super-secret-key-change-this-in-production
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- User authentication (register/login)
- Product listing
- Product management (add/edit/delete)
- Responsive design with Tailwind CSS
- RESTful API backend
- JWT-based authentication

## Technologies Used

- Frontend:
  - Svelte
  - Tailwind CSS
  - Axios
  - Svelte Routing

- Backend:
  - Node.js
  - Express
  - LowDB (JSON database)
  - JWT for authentication
  - bcrypt for password hashing 
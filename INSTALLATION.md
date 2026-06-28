# Installation and Setup Guide

This guide describes how to set up, configure, and run the **Ziptrrip Tasks** application on your local machine.

## Prerequisites
Ensure you have the following installed:
- **Node.js** (v18.x or above recommended)
- **npm** (v9.x or above)
- **Git** (for cloning and version control)

---

## 1. Setup and Installation

Clone the repository and install dependencies in both the backend and frontend folders.

### Clone the Repository
```bash
git clone <your-repository-link>
cd ziptrrip-todo-app
```

### Backend Installation
Navigate to the `backend` directory and install the packages:
```bash
cd backend
npm install
```

### Frontend Installation
Open a new terminal window, navigate to the `frontend` directory, and install the packages:
```bash
cd ../frontend
npm install
```

---

## 2. Running the Application

Both backend server and frontend Vite development server must be running concurrently.

### Step A: Run the Backend API
In the `backend` terminal, execute the dev command. This boots the Express server on port `5000` with hot-reloading (nodemon):
```bash
cd backend
npm run dev
```
You should see:
```text
Server is running on port 5000
```
To verify the API is running, visit: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Step B: Run the Frontend Development Server
In the `frontend` terminal, execute the dev command:
```bash
cd frontend
npm run dev
```
Vite will compile and host the Multi-Page Application. It usually binds to port `5173`.
You should see:
```text
  VITE v5.2.11  ready in X ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```
Vite is configured to automatically launch the application in your default web browser. If it doesn't open, visit [http://localhost:5173](http://localhost:5173).

---

## 3. Building for Production

To create compiled bundles optimizing assets and pages:

### Build Frontend
Compile the HTML pages (`index.html` and `todo.html`) and their React logic:
```bash
cd frontend
npm run build
```
Vite will output the static assets inside `frontend/dist/`.

### Run Backend in Production
```bash
cd backend
npm start
```

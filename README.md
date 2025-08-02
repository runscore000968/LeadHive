# MERN Lead Distribution System

A comprehensive lead distribution system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows administrators to manage agents and distribute leads from CSV/Excel files.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later) or Yarn
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```bash
   npm start
   # or
   yarn start
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Admin Authentication**: Secure login system with JWT tokens
- **Agent Management**: Add, view, and manage agents with contact details
- **File Upload**: Upload CSV/Excel files with lead information
- **Lead Distribution**: Automatically distribute leads equally among active agents
- **Real-time Updates**: View distributed leads immediately after upload
- **Responsive Design**: Mobile-friendly interface

## Project Structure

```
mern-lead-distribution/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Agent.js
│   │   └── Lead.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── agents.js
│   │   └── upload.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Agents.jsx
│   │   │   └── Upload.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env` file and update with your MongoDB connection string
   - Update the JWT_SECRET with a secure random string

4. Start the backend server:
   ```bash
   npm run dev
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

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage

### Initial Setup

1. **Create Admin Account**:
   - Use the registration endpoint: POST `/api/auth/register`
   - Or create directly in MongoDB

2. **Login**:
   - Navigate to `http://localhost:3000`
   - Login with admin credentials

### Managing Agents

1. **Add Agents**:
   - Navigate to the "Agents" page
   - Click "Add Agent" and fill in the form
   - Agents must have: name, email, mobile, and password

2. **View Agents**:
   - All agents are displayed in a table
   - You can delete agents from the actions column

### Uploading and Distributing Leads

1. **Prepare Your File**:
   - Create a CSV or Excel file with columns:
     - FirstName (required)
     - Phone (required)
     - Notes (optional)

2. **Upload File**:
   - Navigate to "Upload Leads" page
   - Select your CSV/Excel file
   - Click "Upload and Distribute"

3. **View Distribution**:
   - After upload, you'll see how leads were distributed
   - Each agent's assigned leads are displayed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin user
- `POST /api/auth/login` - Login user

### Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Upload & Leads
- `POST /api/upload` - Upload and distribute leads
- `GET /api/upload/leads/:agentId` - Get leads for specific agent

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Vite, Tailwind CSS, React Router
- **Authentication**: JWT (JSON Web Tokens)
- **File Processing**: Multer, CSV-Parser, SheetJS (xlsx)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

## Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure your MongoDB URI is correct
   - Check if MongoDB Atlas allows your IP

2. **CORS Issues**:
   - Backend is configured for CORS
   - Ensure frontend proxy is set up correctly

3. **File Upload Issues**:
   - Check file size (max 5MB)
   - Ensure file format is CSV, XLS, or XLSX
   - Verify column names match requirements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


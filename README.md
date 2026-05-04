# Team Task Manager

A full-stack web application for managing team projects and tasks efficiently. Built with the MERN stack (MongoDB, Express, React, Node.js).

## 🎯 Features

- **User Authentication**: Secure login and signup with JWT tokens
- **Project Management**: Create, view, and manage team projects
- **Task Management**: Assign tasks, track progress, and update task status
- **Dashboard**: Overview of projects and tasks at a glance
- **Shopping Cart**: Add items to cart (extensible for task/project features)
- **Role-Based Access**: Protected routes and authenticated operations
- **Responsive Design**: Beautiful UI with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Library**: React 19
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```

### 2. Backend Setup

```bash
cd "team task manager backend"

# Install dependencies
npm install

# Create .env file from example
cp env.example .env

# Update .env with your values
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A strong random secret
# - PORT: Server port (default: 5000)
# - NODE_ENV: development/production
# - CLIENT_URL: Frontend URL
```

#### Environment Variables (.env)
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_long_random_secret_key_here
JWT_EXPIRES_IN=1d
```

### 3. Start MongoDB

**Option A: Using Docker (Recommended)**
```bash
npm run db:up
```

**Option B: Local MongoDB**
```bash
# Make sure MongoDB service is running on your system
```

### 4. Start Backend Server
```bash
npm run dev
```
Backend runs at `http://localhost:5000`

### 5. Frontend Setup

```bash
cd "../team task manager frontend"

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs at `http://localhost:5173`

## 📦 Project Structure

```
team-task-manager/
├── team task manager backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── common/
│   │   │   ├── config/
│   │   │   │   └── db.js          # Database connection
│   │   │   ├── dto/
│   │   │   │   └── base.dto.js    # Base DTO
│   │   │   ├── middleware/
│   │   │   │   └── validate.middleware.js
│   │   │   └── utils/
│   │   │       ├── api-error.js
│   │   │       ├── api-response.js
│   │   │       └── jwt.utils.js
│   │   └── modules/
│   │       ├── auth/              # Authentication module
│   │       ├── project/           # Project management
│   │       ├── task/              # Task management
│   │       ├── dashboard/         # Dashboard
│   │       └── cart/              # Cart functionality
│   ├── server.js                  # Entry point
│   ├── package.json
│   └── docker-compose.yml
│
├── team task manager frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React entry point
│   │   ├── api/
│   │   │   └── api.js             # Axios API client
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Tasks.jsx
│   │   ├── utils/
│   │   │   └── auth.js
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Dashboard
- `GET /api/dashboard` - Get dashboard data

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🔐 Authentication

The app uses JWT tokens for authentication:
1. User signs up/logs in
2. Backend issues JWT token
3. Token stored in browser localStorage
4. Sent in `Authorization: Bearer <token>` header for protected routes

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
```
Deploy the `dist` folder to Vercel, Netlify, or similar.

### Backend (Railway/Heroku)
1. Set environment variables
2. Set MongoDB Atlas connection string
3. Update `CLIENT_URL` to your frontend domain
4. Push to repository and deploy

## 📝 Scripts

### Backend
```bash
npm run dev         # Start development server with nodemon
npm start           # Start production server
npm run db:up       # Start MongoDB with Docker
npm run db:down     # Stop MongoDB Docker container
```

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Connection Refused
- Ensure backend server is running on port 5000
- Check MongoDB is running (docker or local)

### CORS Errors
- Verify `CLIENT_URL` in backend `.env`
- Check frontend `vite.config.js` proxy settings

### JWT Errors
- Ensure `JWT_SECRET` is set in `.env`
- Clear browser localStorage and re-login

### Build Issues
- Delete `node_modules` and run `npm install`
- Clear npm cache: `npm cache clean --force`

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Happy coding!** 🎉

# Task Board React Application

A full-stack task management application built with React.js and Node.js/Express, featuring user authentication, task lists, and dynamic task management.

## 🌐 Live Demo

**Deployed Application**: [Your Vercel/Netlify/Heroku Link Here]

**Demo Video**: [Your Loom/YouTube Video Link Here]

## 📸 Screenshots

Application design inspired by: [https://imgur.com/a/Yy754Ie](https://imgur.com/a/Yy754Ie)

## 🚀 Tech Stack

### Frontend

- **React.js** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and development server

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### External APIs

- **Picsum Photos API** - Random profile images
  - Endpoint: `https://picsum.photos/id/<random-0-999>/info`

## ✨ Features

### Core Functionality

- **User Authentication**

  - User registration and login
  - JWT-based authentication
  - Protected routes
  - Secure password hashing

- **Task Management**

  - Create multiple task lists
  - Add, edit, and delete tasks
  - Mark tasks as complete/incomplete
  - Real-time task updates

- **User Interface**
  - Responsive design (mobile and desktop)
  - Random profile icons from Picsum API
  - Interactive modals and forms
  - Clean, modern UI with Tailwind CSS

### Pages

1. **Login Page** - User authentication
2. **Signup Page** - User registration
3. **Dashboard** - Main task board interface

## 🏗️ Project Structure

```
reactjs-sample-0225/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   └── user.controller.js    # User authentication logic
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT authentication middleware
│   ├── models/
│   │   ├── user.model.js         # User schema
│   │   ├── task.model.js         # Task schema
│   │   └── tasklist.model.js     # Task list schema
│   ├── routes/
│   │   ├── user.routes.js        # User routes
│   │   └── task.routes.js        # Task routes
│   └── index.js                  # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProfileIcon.jsx   # Random profile image component
│   │   │   ├── TaskBoard.jsx     # Task list component
│   │   │   └── TaskModal.jsx     # Task edit/delete modal
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx     # Login interface
│   │   │   ├── SignupPage.jsx    # Registration interface
│   │   │   └── Dashboard.jsx     # Main dashboard
│   │   └── App.jsx               # Main app component
│   └── .env                      # Environment variables
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/reactjs-sample-0225.git
cd reactjs-sample-0225/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:

```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:

```bash
npm run dev
```

## 🔑 API Endpoints

### Authentication

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)

### Task Management

- `GET /api/tasks/lists` - Get all task lists for user
- `POST /api/tasks/lists` - Create new task list
- `GET /api/tasks/list/:listId` - Get tasks for specific list
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task

## 🎯 Key Features Implementation

### Random Profile Icons

- Integrates with Picsum Photos API
- Generates random profile images using IDs 0-999
- Includes fallback handling for failed requests
- Implements loading states and error handling

### Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive grid layouts for task boards
- Adaptive navigation and modals
- Touch-friendly interface elements

### Authentication Flow

- JWT-based authentication
- Protected routes with middleware
- Automatic token validation
- Secure logout functionality

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

1. Create new app on hosting platform
2. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT`
3. Deploy from GitHub repository

### Frontend Deployment (Vercel/Netlify)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

## 🧪 Testing

### Future Improvements

- Jest and Enzyme test cases for components
- API endpoint testing
- User flow integration tests

### Web3 Integration (Bonus)

- Potential integration with web3.js or ethers.js
- Blockchain-based task verification
- Decentralized user authentication

## 🔄 Future Enhancements

- [ ] Drag and drop task reordering
- [ ] Task categories and tags
- [ ] Due dates and reminders
- [ ] Team collaboration features
- [ ] Task attachments
- [ ] Advanced filtering and search
- [ ] Dark mode support
- [ ] PWA capabilities

## 📝 Development Notes

### Assumptions Made

1. Users can create multiple task lists
2. Tasks belong to specific lists and users
3. Profile images are randomly generated for demonstration
4. Basic CRUD operations are sufficient for MVP

### Known Issues

1. Profile images may occasionally fail to load due to API limitations
2. No real-time collaboration features implemented
3. Limited error handling for network failures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is created for educational and demonstration purposes.

## 📞 Contact

- GitHub: [Your GitHub Profile]
- Video Demo: [Your Loom/YouTube Link]
- Live Demo: [Your Deployed App Link]

---

**Project Timeline**: Completed within 3 days as per requirements
**Submission Date**: February 2025

# 📋 Task Manager - MERN Stack

<div align="center">

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**A complete task management system built with MERN Stack**

[Features](#-features) • [Installation](#-installation) • [Configuration](#-configuration) • [Structure](#-project-structure) • [Roadmap](#-roadmap)

</div>

---

## 📖 About The Project

Task Manager is a full-stack task management application that allows users to create, organize, and track their tasks efficiently. The project implements complete authentication, permission system (Admin/User), dashboard with statistics, and full CRUD functionality for tasks.

### 🎯 Purpose

Developed as a learning project following the [Time to Program](https://www.youtube.com/@TimetoProgram) tutorial, this project demonstrates the complete implementation of a MERN application with development best practices.

---

## ✨ Features

### 🔐 Authentication & Authorization

- ✅ User registration with validation
- ✅ Login/Logout with JWT tokens
- ✅ Permission system (Admin/User roles)
- ✅ Protected routes on frontend and backend
- ✅ Refresh tokens for persistent sessions

### 📊 Dashboard

- ✅ Task statistics (total, pending, in progress, completed)
- ✅ Interactive charts (Recharts)
  - Pie chart for status distribution
  - Bar chart for priority levels
- ✅ Recent tasks list
- ✅ Info cards with counters

### ✏️ Task Management

- ✅ **Complete CRUD**
  - Create tasks with validation
  - Edit tasks preserving state
  - Delete with confirmation
  - List with filters
- ✅ **Task Fields**
  - Title and description
  - Priority (Low, Medium, High)
  - Due date
  - Multiple user assignment
  - Subtask checklist with progress
  - Attachments/Links
- ✅ **Filters and Visualization**
  - Filter by status (All, Pending, In Progress, Completed)
  - Visual cards with color coding
  - Dynamic progress bar
  - Assigned user avatars

### 👥 User Management (Admin)

- ✅ View all users
- ✅ Manage permissions (Admin/User)
- ✅ User statistics

### 🎨 User Interface

- ✅ Responsive design (Mobile-first)
- ✅ Dark mode ready (structure prepared)
- ✅ Visual feedback with toast notifications
- ✅ Modals for confirmations
- ✅ Reusable components
- ✅ Smooth animations and transitions

---

## 🛠️ Tech Stack

### Frontend

```json
{
  "framework": "React 19.2.0",
  "build": "Vite 7.2.2",
  "routing": "React Router 7.9.5",
  "styling": "Tailwind CSS 4.1.17",
  "charts": "Recharts 3.4.1",
  "forms": "Custom hooks",
  "http": "Axios 1.13.2",
  "notifications": "React Hot Toast 2.5.1",
  "icons": "React Icons 5.5.0 + Lucide React 0.469.0",
  "date": "Moment.js 2.30.1"
}
```

### Backend

```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js 4.18",
  "database": "MongoDB 7.0",
  "auth": "JWT (jsonwebtoken 9.0.2)",
  "validation": "Express Validator",
  "security": "bcryptjs, helmet, cors",
  "upload": "Multer",
  "env": "dotenv"
}
```

---

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/mrfernandodias/taskmanager.git
cd taskmanager
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend/Task-Manager
npm install
```

---

## 🔧 Configuration

### Backend (.env)

Create a `.env` file in the `backend/` folder:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/taskmanager

# JWT
JWT_SECRET=your_super_secure_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### Frontend (vite.config.js)

The file is already configured for automatic proxy:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

---

## 🚀 Running the Project

### Development

#### 1. Start MongoDB

```bash
# Linux/Mac
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### 2. Start Backend

```bash
cd backend
npm run dev
```

Server running at: `http://localhost:8000`

#### 3. Start Frontend

```bash
cd frontend/Task-Manager
npm run dev
```

Application running at: `http://localhost:5173`

### Production

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend/Task-Manager
npm run build
npm run preview
```

---

## 📂 Project Structure

```
taskmanager/
├── backend/
│   ├── config/
│   │   └── db.js                 # Configuração MongoDB
│   ├── controllers/
│   │   ├── authController.js     # Lógica de autenticação
│   │   ├── taskController.js     # CRUD de tarefas
│   │   ├── userController.js     # Gestão de usuários
│   │   └── reportController.js   # Relatórios e estatísticas
│   ├── middlewares/
│   │   ├── authMiddleware.js     # Verificação JWT
│   │   └── uploadMiddleware.js   # Upload de arquivos
│   ├── models/
│   │   ├── User.js               # Schema de usuário
│   │   └── Task.js               # Schema de tarefa
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── userRoutes.js
│   │   └── reportRoutes.js
│   ├── uploads/                  # Arquivos enviados
│   ├── .env                      # Variáveis de ambiente
│   ├── server.js                 # Entry point
│   └── package.json
│
└── frontend/Task-Manager/
    ├── public/                   # Assets estáticos
    ├── src/
    │   ├── assets/              # Imagens, fonts, etc
    │   ├── components/
    │   │   ├── Cards/
    │   │   │   ├── InfoCard.jsx
    │   │   │   └── TaskCard.jsx
    │   │   ├── Charts/
    │   │   │   ├── CustomBarChart.jsx
    │   │   │   ├── CustomPieChart.jsx
    │   │   │   └── CustomLegend.jsx
    │   │   ├── Inputs/
    │   │   │   ├── SelectDropdown.jsx
    │   │   │   ├── SelectUsers.jsx
    │   │   │   ├── TodoListInput.jsx
    │   │   │   └── AddAttachmentsInput.jsx
    │   │   ├── layouts/
    │   │   │   └── DashboardLayout.jsx
    │   │   ├── AvatarGroup.jsx
    │   │   ├── DeleteAlert.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Progress.jsx
    │   │   ├── TaskListTable.jsx
    │   │   └── TaskStatusTabs.jsx
    │   ├── contexts/
    │   │   └── UserContext.jsx   # Authentication context
    │   ├── hooks/
    │   │   └── useUserAuth.js    # Custom auth hook
    │   ├── pages/
    │   │   ├── Admin/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── CreateTask.jsx
    │   │   │   ├── ManageTasks.jsx
    │   │   │   └── ManageUsers.jsx
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── SignUp.jsx
    │   │   └── User/
    │   │       ├── UserDashboard.jsx
    │   │       ├── MyTasks.jsx
    │   │       └── ViewTaskDetails.jsx
    │   ├── routes/
    │   │   └── PrivateRoute.jsx  # Protected routes
    │   ├── utils/
    │   │   ├── apiPath.js        # Centralized endpoints
    │   │   ├── axiosInstance.js  # Configured Axios
    │   │   ├── data.js           # Static data
    │   │   └── helper.js         # Helper functions
    │   ├── App.jsx               # Main routes
    │   ├── main.jsx              # Entry point
    │   └── index.css             # Global styles
    ├── .env                      # Environment variables
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🎯 How to Use

### 1. Create Account

- Access `http://localhost:5173`
- Click "Sign Up"
- Fill in your details and create your account

### 2. Login

- Login with your credentials
- You will be redirected to the appropriate dashboard (Admin or User)

### 3. Dashboard

- View your task statistics
- Interactive charts show distribution and priorities
- See your recent tasks

### 4. Create Task (Admin)

- Navigate to "Create Task"
- Fill in:
  - Title and description
  - Priority (Low/Medium/High)
  - Due date
  - Assign users
  - Add subtask checklist
  - Attach links
- Click "CREATE TASK"

### 5. Manage Tasks

- Access "Manage Tasks"
- Filter by status (All, Pending, In Progress, Completed)
- Click on a task to edit
- Delete tasks when needed

### 6. View Tasks (User)

- Regular users only see tasks assigned to them
- Can update checklist progress
- Mark tasks as completed

---

## 🗺️ Roadmap

> 🚧 **Under Development**
>
> This section will be filled with upcoming features and planned improvements for the project.

### Planned Features

- [ ] Real-time notifications system
- [ ] Advanced filters and search
- [ ] Drag & drop to reorder tasks
- [ ] File attachments (not just links)
- [ ] Task comments system
- [ ] Change history
- [ ] Report exports (PDF/Excel)
- [ ] Complete dark mode
- [ ] Unit and E2E testing
- [ ] PWA (Progressive Web App)
- [ ] Project dockerization
- [ ] CI/CD Pipeline

### Technical Improvements

- [ ] Implement React Query for caching
- [ ] Add WebSockets (Socket.io)
- [ ] Performance optimization
- [ ] Accessibility (ARIA labels)
- [ ] Internationalization (i18n)
- [ ] Backend rate limiting
- [ ] Structured logging
- [ ] Monitoring and metrics

---

## 📸 Screenshots

> 🖼️ Screenshots will be added soon

---

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

---

## 👨‍💻 Author

**Fernando Dias**

- GitHub: [@mrfernandodias](https://github.com/mrfernandodias)
- LinkedIn: [Fernando Dias](https://linkedin.com/in/mrfernandodias)

---

## 🙏 Acknowledgments

- [Time to Program](https://www.youtube.com/@TimetoProgram) - Base tutorial
- React, Node.js and MongoDB communities
- All open source developers whose libraries were used

---

<div align="center">

**⭐ If this project was helpful to you, consider giving it a star!**

Made with ❤️ and ☕

</div>

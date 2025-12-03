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

### Backend Environment Variables

Create a `.env` file in the `backend/` folder (use `.env.example` as template):

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/taskmanager

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173

# Admin Invite Token (for creating admin users)
ADMIN_INVITE_TOKEN=your_secure_admin_invite_token_here

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

**Security Tips:**

- Generate secure JWT secrets: `openssl rand -base64 32`
- Generate admin token: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Never commit your `.env` file to version control

### Frontend Environment Variables

Create a `.env` file in the `frontend/Task-Manager/` folder (use `.env.example` as template):

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# App Configuration
VITE_APP_NAME=Task Manager
VITE_APP_VERSION=1.0.0

# Admin Invite Token (must match backend)
VITE_ADMIN_INVITE_TOKEN=your_secure_admin_invite_token_here
```

**Note:** The Vite proxy is configured in `vite.config.js` to automatically route `/api` requests to the backend.

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

### 3. Create Task (Admin)

- Navigate to "Create Task"
- Fill in the required information:
  - **Title**: Clear and descriptive task name
  - **Description**: Detailed task information
  - **Priority**: Choose Low, Medium, or High
  - **Due Date**: Set task deadline
  - **Assign Users**: Select team members to work on this task
  - **Todo Checklist**: Add subtasks/checklist items
  - **Attachments**: Add relevant links or resources
- Click "CREATE TASK"
- Task is created and assigned users will see it in their dashboard

### 4. Manage Tasks (Admin)

- Access "Manage Tasks" from the sidebar
- Use filters to view tasks by status:
  - **All**: View all tasks
  - **Pending**: Tasks not yet started
  - **In Progress**: Active tasks
  - **Completed**: Finished tasks
- **Edit**: Click on any task to modify details
- **Delete**: Remove tasks with confirmation dialog
- **Export**: Download task reports in Excel format
- Each task card shows:
  - Progress bar with completion percentage
  - Priority level with color coding
  - Assigned team member avatars
  - Due date and status

### 5. View My Tasks (User)

- Regular users see only tasks assigned to them
- Access "My Tasks" to view your task list
- Click on a task to see full details:
  - Title, description, priority
  - Due date and status
  - Assigned team members
  - Todo checklist with progress tracking
  - Attachments and links

### 6. Update Task Progress (User)

- Open task details
- Check/uncheck items in the todo checklist
- Progress updates automatically:
  - 0% → Status: Pending
  - 1-99% → Status: In Progress
  - 100% → Status: Completed
- Changes are saved instantly

### 7. User Management (Admin)

- Access "Manage Users" from the sidebar
- View all team members with:
  - Profile information
  - Task statistics (Pending, In Progress, Completed)
  - User role (Admin/Member)
- **Export**: Download user reports in Excel format

### 8. Dashboard Analytics

- View comprehensive statistics:
  - **Total Tasks**: All tasks in the system
  - **Pending**: Tasks waiting to start
  - **In Progress**: Active tasks
  - **Completed**: Finished tasks
  - **Overdue**: Late tasks (not completed by due date)
- Interactive charts:
  - **Pie Chart**: Task distribution by status
  - **Bar Chart**: Tasks by priority level
- Recent tasks list with quick access

---

## 🗺️ Roadmap

> 🚧 **Under Development**
>
> This section tracks upcoming features and improvements for the project.

### 🎯 Planned Features

#### User Management Enhancements

- [ ] Edit user profile (name, email, avatar)
- [ ] Change user role (Admin/User)
- [ ] Delete/deactivate users
- [ ] User statistics dashboard
- [ ] Bulk user actions
- [ ] User search and filtering

#### Task Management Improvements

- [ ] Advanced filters (priority, assignee, date range)
- [ ] Search functionality
- [ ] Drag & drop to reorder tasks
- [ ] Bulk task operations
- [ ] Task templates
- [ ] Recurring tasks

#### Reports & Analytics

- [x] Export users report (Excel) ✅
- [x] Export tasks report (Excel) ✅
- [ ] Export to PDF format
- [ ] Custom report builder
- [ ] Analytics dashboard
- [ ] Performance metrics

#### Collaboration Features

- [ ] Real-time notifications system
- [ ] Task comments system
- [ ] @mentions in comments
- [ ] Activity feed/timeline
- [ ] Change history tracking
- [ ] File attachments (not just links)

#### User Experience

- [ ] Complete dark mode
- [ ] Mobile app (React Native)
- [ ] PWA (Progressive Web App)
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements (ARIA labels)
- [ ] Internationalization (i18n - PT-BR, EN)

### 🔧 Technical Improvements

#### Performance

- [ ] Implement React Query for caching
- [ ] useMemo/useCallback optimization
- [ ] Code splitting and lazy loading
- [ ] Image optimization
- [ ] Database indexing

#### Architecture

- [ ] Add WebSockets (Socket.io) for real-time updates
- [ ] Implement Redis for session management
- [ ] API rate limiting
- [ ] Request throttling/debouncing

#### Quality & Security

- [ ] Unit tests (Jest + React Testing Library)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Integration tests
- [ ] Security audit
- [ ] Input sanitization
- [ ] CSRF protection

#### DevOps

- [ ] Project dockerization
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] Automated deployments
- [ ] Structured logging (Winston)
- [ ] Monitoring and metrics (Prometheus/Grafana)
- [ ] Error tracking (Sentry)

---

## 📸 Screenshots

> 🖼️ Screenshots coming soon! The application features:
>
> - Clean and modern dashboard with statistics and charts
> - Intuitive task creation and management interface
> - Responsive design that works on all devices
> - Beautiful gradient themes and smooth animations

---

## 🌐 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/profile      - Get user profile
PUT    /api/auth/profile      - Update user profile
```

### Task Endpoints

```
GET    /api/tasks                      - Get all tasks (filtered by role)
GET    /api/tasks/:id                  - Get task by ID
POST   /api/tasks                      - Create new task (Admin)
PUT    /api/tasks/:id                  - Update task
DELETE /api/tasks/:id                  - Delete task (Admin)
PUT    /api/tasks/:id/status           - Update task status
PUT    /api/tasks/:id/todo             - Update task checklist
GET    /api/tasks/dashboard-data       - Get admin dashboard data
GET    /api/tasks/user-dashboard-data  - Get user dashboard data
```

### User Management Endpoints

```
GET    /api/users              - Get all users (Admin)
GET    /api/users/:id          - Get user by ID
PUT    /api/users/:id/role     - Update user role (Admin)
```

### Report Endpoints

```
GET    /api/reports/exports/tasks  - Export tasks to Excel
GET    /api/reports/exports/users  - Export users to Excel (Admin)
```

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

---

## 🤝 Contributing

Contributions are welcome! This project was created for learning purposes, and improvements are always appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Commit Convention

This project follows the Conventional Commits specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, missing semi-colons, etc)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Build process or auxiliary tool changes

### Development Guidelines

- Write clean, readable code
- Follow existing code style and patterns
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed
- Use React hooks best practices (useCallback, useMemo for optimization)
- Handle errors gracefully with try-catch
- Validate user inputs on both frontend and backend

---

## 🐛 Known Issues & Limitations

- [ ] File attachments currently only support links (not actual file uploads via UI)
- [ ] No real-time notifications (requires WebSocket implementation)
- [ ] No task comment system yet
- [ ] Dark mode is prepared but not fully implemented
- [ ] No email notifications for task assignments or updates
- [ ] Limited error messages for network failures

See the [Roadmap](#-roadmap) for planned improvements.

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend/Task-Manager
npm test
```

### Code Quality

Both frontend and backend include ESLint for code quality:

```bash
# Backend linting
cd backend
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues

# Frontend linting
cd frontend/Task-Manager
npm run lint        # Check for issues
```

---

## 🚀 Deployment

### Backend Deployment

**Popular Options:**

- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Modern platform with great DX
- **Render**: Free tier available
- **DigitalOcean**: VPS for more control
- **AWS EC2**: Production-grade infrastructure

**Deployment Checklist:**

- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or production database
- [ ] Configure proper CORS origins
- [ ] Set secure JWT secrets
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Enable helmet.js for security headers

### Frontend Deployment

**Popular Options:**

- **Vercel**: Optimized for Vite/React (Recommended)
- **Netlify**: Simple deployment with CI/CD
- **GitHub Pages**: Free static hosting
- **Cloudflare Pages**: Fast global CDN

**Deployment Checklist:**

- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Build production bundle: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Configure environment variables
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS
- [ ] Configure proper redirects for SPA

### Docker Deployment (Optional)

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down
```

---

## 📊 Project Stats

```
Backend:
- 4 Models (User, Task)
- 15+ API Endpoints
- JWT Authentication
- Role-Based Authorization
- Excel Report Generation

Frontend:
- 20+ React Components
- 8 Pages (Auth, Admin, User views)
- Custom Hooks
- Context API for State Management
- Responsive Design
- Chart Visualizations
```

---

## 📚 Learning Resources

This project was built following excellent tutorials and documentation:

- **[Time to Program - MERN Stack Tutorial](https://www.youtube.com/@TimetoProgram)** - Base tutorial
- **[React Official Documentation](https://react.dev)** - React hooks and best practices
- **[MongoDB Documentation](https://docs.mongodb.com)** - Database design patterns
- **[Express.js Guide](https://expressjs.com)** - Backend API development
- **[Tailwind CSS Docs](https://tailwindcss.com/docs)** - Utility-first CSS framework

---

## ❓ FAQ (Frequently Asked Questions)

<details>
<summary><strong>How do I create an admin user?</strong></summary>

You need to use the `ADMIN_INVITE_TOKEN` during registration:

1. Set the token in your backend `.env` file
2. Include it in the registration request
3. The user will be created with admin role

You can also manually update a user's role in the database:

```javascript
db.users.updateOne({ email: 'admin@example.com' }, { $set: { role: 'admin' } });
```

</details>

<details>
<summary><strong>Why can't I see all tasks as a regular user?</strong></summary>

Regular users (role: `member`) can only see tasks assigned to them. This is by design to prevent information overload and maintain privacy. Admin users can see all tasks in the system.

</details>

<details>
<summary><strong>How does the task progress calculation work?</strong></summary>

Progress is calculated automatically based on the todo checklist:

- `Progress = (Completed Items / Total Items) × 100`
- The status updates automatically:
  - 0% → Pending
  - 1-99% → In Progress
  - 100% → Completed
  </details>

<details>
<summary><strong>Can I upload files as attachments?</strong></summary>

Currently, the application only supports link attachments (URLs). File upload functionality is planned for future releases. You can add links to cloud storage (Google Drive, Dropbox, etc.) as a workaround.

</details>

<details>
<summary><strong>How do I change the MongoDB connection?</strong></summary>

Update the `MONGODB_URI` in your backend `.env` file:

**Local MongoDB:**

```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

**MongoDB Atlas (Cloud):**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
```

</details>

<details>
<summary><strong>Why am I getting CORS errors?</strong></summary>

Make sure:

1. Backend is running and accessible
2. `CLIENT_URL` in backend `.env` matches your frontend URL
3. Vite proxy is configured in `vite.config.js`
4. Both backend and frontend are running on expected ports
</details>

<details>
<summary><strong>How can I contribute to this project?</strong></summary>

Contributions are welcome! See the [Contributing](#-contributing) section for guidelines. You can:

- Report bugs via GitHub issues
- Suggest new features
- Submit pull requests
- Improve documentation
</details>

<details>
<summary><strong>Is this project production-ready?</strong></summary>

This is a learning project. While it implements many best practices, additional work is needed for production:

- Add comprehensive testing
- Implement rate limiting
- Add input sanitization
- Set up monitoring and logging
- Implement proper error tracking
- Add security headers (helmet.js)
- Configure production-grade database
- Set up CI/CD pipeline

See the [Roadmap](#-roadmap) for planned improvements.

</details>

---

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

---

## 👨‍💻 Author

**Fernando Dias**

- GitHub: [@mrfernandodias](https://github.com/mrfernandodias)
- LinkedIn: [Fernando Dias](https://linkedin.com/in/mrfernandodias)

<a href="https://www.buymeacoffee.com/fernandodias" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="40" width="170">
</a>

---

## 🙏 Acknowledgments

- **[Time to Program](https://www.youtube.com/@TimetoProgram)** - Excellent MERN Stack tutorial that served as the foundation for this project
- React, Node.js, MongoDB, and Express.js communities for outstanding documentation
- All open source library maintainers whose work made this project possible
- The developer community for sharing knowledge and best practices

---

## 💬 Support

If you found this project helpful:

- ⭐ **Star this repository** to show your support
- 🐛 **Report bugs** by opening an issue
- 💡 **Suggest features** via GitHub issues
- 🤝 **Contribute** by submitting pull requests
- ☕ **Buy me a coffee** if you'd like to support my learning journey

<a href="https://www.buymeacoffee.com/fernandodias" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50" width="200">
</a>

---

## 📬 Contact

**Fernando Dias**

- 💼 LinkedIn: [@mrfernandodias](https://linkedin.com/in/mrfernandodias)
- 🐙 GitHub: [@mrfernandodias](https://github.com/mrfernandodias)
- 📧 Email: [your.email@example.com](mailto:your.email@example.com)
- 🌐 Portfolio: [yourportfolio.com](https://yourportfolio.com)

---

<div align="center">

**⭐ If this project was helpful to you, consider giving it a star!**

Made with ❤️ and ☕

</div>

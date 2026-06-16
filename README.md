# Community Helpdesk for Cyber Safety Queries

A comprehensive web application designed to help users ask cyber safety questions, report cyber incidents, access awareness resources, and receive expert responses from administrators.

## 🚀 Features

- **User Authentication**: JWT-based secure authentication
- **Query Management**: Submit, view, and answer cyber safety questions
- **Incident Reporting**: Report cyber incidents with detailed information
- **Resource Center**: Access curated cyber safety resources and articles
- **User Dashboard**: Personalized dashboard with query history and notifications
- **Admin Dashboard**: Manage queries, incidents, and users
- **Search & Filter**: Find relevant questions and resources quickly
- **Notifications**: Real-time notifications for query responses
- **Dark/Light Mode**: Theme switching for better user experience
- **Responsive Design**: Works seamlessly on all devices

## 📋 Modules

1. **Home Page** - Landing page with overview
2. **About Page** - Information about the helpdesk
3. **User Registration** - Create new account
4. **User Login** - Secure authentication
5. **User Dashboard** - Personal dashboard and activity
6. **Ask Cyber Query** - Submit questions
7. **View Queries** - Browse and search questions
8. **Cyber Safety Resources** - Educational materials
9. **Report Cyber Incident** - Report security incidents
10. **User Profile** - Manage profile information
11. **Admin Dashboard** - Administrative panel

## 💻 Technology Stack

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Material-UI/Bootstrap** - UI components
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
community-helpdesk-for-cyber-safety-queries/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── queryController.js
│   │   ├── answerController.js
│   │   ├── incidentController.js
│   │   ├── resourceController.js
│   │   └── notificationController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Query.js
│   │   ├── Answer.js
│   │   ├── IncidentReport.js
│   │   ├── Resource.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── queries.js
│   │   ├── answers.js
│   │   ├── incidents.js
│   │   ├── resources.js
│   │   └── notifications.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT secret
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env and add your backend API URL
npm start
```

### Running Both

From root directory:

```bash
npm run install-all
npm run dev
```

## 📊 Database Schema

### Collections

**Users**
- _id, email, username, password, firstName, lastName, phone, role, avatar, createdAt, updatedAt

**Queries**
- _id, userId, title, description, category, tags, views, solved, createdAt, updatedAt

**Answers**
- _id, queryId, userId, content, isAccepted, upvotes, downvotes, createdAt, updatedAt

**Resources**
- _id, title, description, content, category, link, author, views, createdAt, updatedAt

**IncidentReports**
- _id, userId, title, description, type, severity, status, createdAt, updatedAt

**Notifications**
- _id, userId, type, message, read, relatedItem, createdAt

## 🔐 Authentication

- JWT-based authentication
- Passwords hashed using bcryptjs
- Token stored in localStorage
- Protected routes require valid JWT

## 🎨 UI Features

- Responsive design (Mobile, Tablet, Desktop)
- Dark/Light mode toggle
- Search functionality
- Filter and sort options
- Form validation
- Error handling
- Loading states

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Queries
- `GET /api/queries` - Get all queries
- `POST /api/queries` - Create query
- `GET /api/queries/:id` - Get query details
- `PUT /api/queries/:id` - Update query
- `DELETE /api/queries/:id` - Delete query

### Answers
- `GET /api/answers/:queryId` - Get query answers
- `POST /api/answers` - Submit answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer

### Incidents
- `GET /api/incidents` - Get incidents
- `POST /api/incidents` - Report incident
- `PUT /api/incidents/:id` - Update incident

### Resources
- `GET /api/resources` - Get resources
- `POST /api/resources` - Create resource (admin)
- `PUT /api/resources/:id` - Update resource (admin)

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

## 🚢 Deployment

### Backend Deployment (Heroku/Railway)
```bash
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
```

## 📖 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Support

For support, email support@cybersafetyhelpdesk.com or open an issue in the repository.

## 🙏 Acknowledgments

- Community contributors
- Cyber safety experts
- Open source community

---

**Last Updated**: June 2026
**Version**: 1.0.0

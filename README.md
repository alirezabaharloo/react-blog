# News Portal


A modern, responsive news portal built with React and Django REST Framework, featuring beautiful animations, user authentication, article search, and category browsing.

## 📋 Overview

News Portal is a full-stack web application that offers users a seamless experience to browse, search, and read news articles. The application features a modern UI with smooth animations powered by Framer Motion, a responsive design that works on all devices, and a robust backend API powered by Django REST Framework.

## ✨ Features

### Frontend
- 🎨 Beautiful responsive UI with clean design
- ✅ User authentication (login/register)
- 🔍 Real-time article search with suggestions
- 📱 Mobile-friendly with hamburger menu
- 🖼️ Smooth animations and transitions
- 📰 Article categories and filtering
- 📄 Article detail pages

### Backend
- 🐍 Django REST Framework backend
- 📊 Category and article system
- 🔍 Full-text search capability
- 🔄 RESTful API architecture

## 🚀 Getting Started

This project consists of two parts: the frontend (React) and the backend (Django). Follow the instructions below to set up both parts.

### Prerequisites

- Node.js (v14.0 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)


## 🔧 Installation & Setup

### Backend Setup

1. Clone the repository
   ```bash
   git clone [https://github.com/yourusername/news-portal.git](https://github.com/alirezabaharloo/react-blog.git)
   cd react-blog/backend
   ```

2. Create and activate a virtual environment
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Apply migrations
   ```bash
   python manage.py migrate
   ```

5. Start the backend server
   ```bash
   python manage.py runserver
   ```
   The server will start on http://localhost:8000

### Frontend Setup

1. Navigate to the root directory

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:3000

## 📖 How to Use the Application

### As a Visitor

1. **Browse Articles**
   - Visit the homepage to see featured articles
   - Navigate to the "Articles" page to see all articles
   - Use category filters to narrow down articles by topic

2. **Search for Content**
   - Use the search bar in the header to find specific articles
   - Get real-time suggestions as you type
   - Click on a suggestion to go directly to that article

3. **Read Articles**
   - Click on any article card to read the full content
   - Navigate through related articles at the bottom of each article


## 🧑‍💻 Developer Guide

### Project Structure

```
news-portal/
├── backend/                  # Django backend
│   ├── newsportal/           # Main Django project
│   ├── api/                  # Django REST API app
│   │   ├── serializers.py    # API serializers
│   │   ├── views.py          # API views
│   │   ├── urls.py           # API routes
│   ├── articles/             # Articles app
│   │   ├── models.py         # Database models
│   │   ├── admin.py          # Admin configuration
│   ├── manage.py             # Django management script
│
└── frontend/                 # React frontend
    ├── public/               # Static files
    └── src/                  # Source files
        ├── components/       # UI components
        ├── context/          # React context
        ├── data/             # Static data
        ├── pages/            # Page components
        └── App.jsx           # Main component
```

### API Endpoints

| Endpoint                 | Method | Description                     |
|--------------------------|--------|---------------------------------|
| `/api/articles/`         | GET    | Get all articles                |
| `/api/articles/<id>/`    | GET    | Get article by ID               |
| `/api/articles/search/`  | GET    | Search articles                 |
| `/api/categories/`       | GET    | Get all categories              |

## 📱 Responsive Design

The application is fully responsive and works on all devices:

- Desktop: Full navigation with search
- Tablet: Adjusted spacing and layout
- Mobile: Hamburger menu, optimized content layout



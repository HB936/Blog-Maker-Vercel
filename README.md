# Full Stack Blog Editor with Auto-Save Draft Feature

A full-stack web application that allows users to write, edit, save as drafts, and publish blogs with an auto-save feature.

---

## ✨ Features

- Blog editor page with:
  - Title input
  - Content textarea
  - Tags input (comma-separated)
- Save as Draft
- Publish blog
- Auto-save drafts:
  - Every 30 seconds
  - After 5 seconds of inactivity (debounced)
- Toast notifications for actions (save, error, etc.)
- Blog listing:
  - Separately shows published blogs and drafts
- Edit existing drafts or published posts
- Delete blogs
- Clean UI with Tailwind CSS
- Modular, clean code with proper separation of concerns

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

---

## 📁 Project Structure

```
├── backend
│   ├── controllers
│   │   └── BlogsController.js
│   ├── models
│   │   └── Blog.js
│   ├── routes
│   │   └── BlogsRouter.js
│   ├── index.js
│   └── .env
│
├── frontend
│   ├── components
│   │   └── EditWrapper.jsx
│   ├── pages
│   │   └── index.jsx
│   ├── App.js / main file
│   └── tailwind.config.js
│
├── package.json
├── README.md
└── ...
```

## 🌐 API Endpoints
```
POST    /api/blog/publish        → Save and publish a blog
POST    /api/blog/save-draft     → Save or update a blog draft
GET     /api/blog                → Retrieve all blogs (published + drafts)
GET     /api/blog/:id            → Retrieve a single blog by ID
PATCH   /api/blog/update/:id     → Update a blog (title, content, tags, status)
DELETE  /api/blog/delete/:id     → Delete a blog by ID
```

## 🔁 Auto-Save Logic
- Auto-saves draft every 30 seconds
- Auto-saves draft after 5 seconds of inactivity using debounce
- Sends POST request to /api/blog/save-draft
- Toast notification displayed on successful auto-save

# 🚀 Getting Started
## Prerequisites
- Node.js
- MongoDB
- npm

## Clone the repository or Download it:
- clone: https://github.com/HB936/Blog-Maker.git
- download: https://github.com/HB936/Blog-Maker/archive/refs/heads/main.zip

## Install dependencies:
```
backend:
```
- cd backend
- npm install
- npm --watch index
```
Frontend:
```
- cd frontend
- npm install
- npm run dev

🧹 Clean Architecture Overview
- controllers/ handle business logic
- models/ manage MongoDB schema and interaction
- routes/ define RESTful API endpoints
- frontend/components/ handle reusable UI logic
- Clear distinction between API layer and UI logic

# BlogSpace

BlogSpace is a full-stack blogging platform built using the MERN stack. Users can create accounts, write blog posts, browse articles, and manage their own content.

## Features

- User registration and login
- Protected routes
- JWT-based authentication
- Create blog posts
- Edit and delete own posts
- View individual blog posts
- User profile
- My Posts management
- Search articles
- Responsive design
- Form validation
- Post ownership authorization
- 404 page
- MongoDB database integration

## Tech Stack

### Frontend

- React
- React Router
- Bootstrap
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

```text
BlogSpace
├── backend
└── frontend
```

Getting Started

1. Clone the repository

   git clone <https://github.com/ShivaniVishwakarma07/Blogging_Platform>

   cd Blogging_Platform

2. Install backend dependencies

   cd backend
   npm install

Create a .env file:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=ypou_jwt_secret
Start the backend:

npm run dev 3. Install frontend dependencies

Open another terminal:

cd frontend
npm install

Start the frontend:

npm run dev
Environment Variables

The following environment variables are required for the backend:

MONGO_URI
JWT_SECRET

Do not commit the .env file to GitHub.

Future Improvements
Image upload for blog posts
Rich text editor
Like and bookmark functionality
Pagination improvements
Deployment
Admin dashboard

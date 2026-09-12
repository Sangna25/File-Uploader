
CloudVault is a full-stack cloud storage web application that lets users securely upload, organize, and manage files with authentication and folder support.

## Features

- User registration and login (Passport.js sessions)
- Protected routes for authenticated users
- Upload files with Cloudinary
- Create and manage folders
- Rename and delete files and folders
- Download uploaded files
- Responsive React frontend

## Tech Stack

- **Frontend:** React, React Router, CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** Passport.js
- **File Storage:** Cloudinary
- **Uploads:** Multer

## Project Structure

```text
client/   # React frontend
server/   # Express API
```

## Setup

### Client

```bash
cd client
npm install
npm run dev
```

### Server

```bash
cd server
npm install
npm run dev
```

Create a `.env` file in the `server` folder with your PostgreSQL, Cloudinary, and session credentials before running the server.

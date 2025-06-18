# ChatApp

A full-stack chat application with group and direct messaging, built with React (Vite), Express, and MongoDB. Users can sign up, sign in, create chats, and send messages in real time.

## Features
- User authentication (sign up, sign in)
- Group and direct chats
- Only see chats you are a participant in
- Real-time messaging UI
- Responsive design
- Deployed frontend on GitHub Pages
- Backend API (Express + MongoDB)

## Project Structure
```
ChatApp/
├── backend/           # Express backend
│   ├── app.js         # Main backend server
│   └── package.json   # Backend dependencies
├── frontend/          # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── SignIn.jsx
│   │   │   └── SignUp.jsx
│   │   └── components/
│   │       ├── Button.jsx
│   │       ├── ChatBox.jsx
│   │       └── NavBar.jsx
│   ├── package.json   # Frontend dependencies
│   ├── vite.config.js # Vite config (base path for GitHub Pages)
│   └── ...
├── mongodb_schema/    # Example MongoDB schemas
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB Atlas or local MongoDB instance

### Backend Setup
1. `cd backend`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your MongoDB connection string in `app.js` (already configured for Atlas in this repo).
4. Start the backend server:
   ```sh
   npm start
   ```
   The backend runs on `http://localhost:3307` by default.

### Frontend Setup
1. `cd frontend`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The frontend runs on `http://localhost:5173` by default.

### Production Build & Deploy
1. Set the correct `homepage` in `frontend/package.json` and `base` in `frontend/vite.config.js` (already set for GitHub Pages in this repo).
2. Build the frontend:
   ```sh
   npm run build
   ```
3. Deploy to GitHub Pages:
   ```sh
   npm run deploy
   ```

## API Endpoints (Backend)
- `POST /new-user` — Register a new user
- `POST /login` — User login
- `GET /users` — List all users
- `GET /chats/:participant` — Get all chats for a user (by username)
- `POST /chats` — Create a new chat
- `GET /messages/:chatId` — Get all messages for a chat
- `POST /new-mssg` — Send a new message

## Security & Logic
- Only chats where the user is a participant are shown (both backend and frontend enforce this)
- Passwords are hashed with bcrypt
- All API endpoints validate input

## Notes
- The backend is configured for MongoDB Atlas but can be changed to local MongoDB.
- The frontend uses `HashRouter` for GitHub Pages compatibility.
- If you change the repo name or deployment URL, update both `homepage` in `package.json` and `base` in `vite.config.js`.

## License
MIT

---

Built by Kareem Elsabrouty (me)

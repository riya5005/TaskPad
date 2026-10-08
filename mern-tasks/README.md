# MERN Tasks

A small full-stack task tracker: MongoDB, Express, React (Vite), Node.

## Run it

You need Node 18+ and MongoDB running locally (or a MongoDB Atlas URI).

**1. API**
```
cd server
npm install
cp .env.example .env     # edit MONGO_URI if needed
npm run dev
```

**2. Client** (new terminal)
```
cd client
npm install
npm run dev
```

Open http://localhost:5173.

## API

| Method | Route            | What it does                    |
|--------|------------------|---------------------------------|
| GET    | /api/tasks       | List tasks                      |
| POST   | /api/tasks       | Create a task `{ title }`       |
| PATCH  | /api/tasks/:id   | Update `{ title?, done? }`      |
| DELETE | /api/tasks/:id   | Delete a task                   |

## Structure

```
server/  server.js, models/Task.js, routes/tasks.js
client/  src/App.jsx, src/App.css, vite.config.js (proxies /api to :5000)
```

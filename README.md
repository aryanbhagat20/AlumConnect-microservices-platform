<div align="center">

# 🎓 AlumConnect — Alumni Network Microservices Platform

### A Distributed Microservices System for Alumni-Student Networking

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#prerequisites)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#tech-stack)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](#tech-stack)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)](#tech-stack)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](#tech-stack)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](#tech-stack)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#running-with-docker)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#tech-stack)

<br/>

**AlumConnect** is a full-stack web platform that enables **students**, **alumni**, and **administrators** to interact through a unified networking hub. The backend is decomposed into **7 independent microservices**, each owning its data and communicating asynchronously via **RabbitMQ**, while the **React + Vite** frontend provides a modern, responsive experience.

<br/>

[Get Started →](#-getting-started) · [Architecture →](#-architecture) · [API Reference →](#-api-endpoints) · [Troubleshooting →](#-troubleshooting)

</div>

---

## 📑 Table of Contents

| Section | Description |
| :--- | :--- |
| [✨ Features](#-features) | What the platform can do |
| [🛠 Tech Stack](#-tech-stack) | Technologies used across the system |
| [🏛 Architecture](#-architecture) | How the microservices communicate |
| [📂 Project Structure](#-project-structure) | Repository folder layout |
| [⚙️ Prerequisites](#-prerequisites) | Software you need before starting |
| [🚀 Getting Started](#-getting-started) | Step-by-step setup & run guide |
| [🌐 API Endpoints](#-api-endpoints) | All REST routes documented |
| [🔑 Environment Variables](#-environment-variables) | Complete `.env` reference for every service |
| [🐳 Running with Docker](#-running-with-docker) | One-command full-stack launch |
| [🧪 Health Checks](#-health-checks) | Verify services are alive |
| [🛡 Troubleshooting](#-troubleshooting) | Common issues & fixes |

---

## ✨ Features

| Module | Capabilities |
| :--- | :--- |
| **🔐 Authentication** | JWT-based registration & login with bcrypt password hashing. Separate login flows for Students, Alumni, and Admin. |
| **👤 User Profiles** | Create, update, browse alumni/student profiles. Admin can toggle user status or delete accounts. |
| **🤝 Connections** | Send, accept, or reject connection requests. View pending requests and active connections. |
| **💬 Real-Time Chat** | WebSocket-powered instant messaging via Socket.IO. Conversation history persisted in MongoDB. Message cache layer with Redis. |
| **📅 Events** | Full CRUD for alumni events. Students and alumni can browse and RSVP to events. |
| **🔔 Notifications** | Asynchronous, event-driven notification engine. Consumes connection, chat, and event messages from RabbitMQ and pushes real-time alerts to users via Socket.IO. |
| **🛡 Admin Panel** | Dedicated admin dashboard with user management, event oversight, and platform analytics (Chart.js). |
| **🌐 API Gateway** | Centralized entry point handling JWT verification, request routing, and CORS — the frontend never talks to individual services directly. |

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
| :--- | :--- |
| **Express.js** | REST API framework for all microservices |
| **Mongoose (MongoDB)** | ODM for data modeling & persistence |
| **Redis** | In-memory caching (user profiles, chat) |
| **RabbitMQ (amqplib)** | Async message broker between services |
| **Socket.IO** | Real-time bidirectional communication (Chat & Notifications) |
| **JSON Web Tokens** | Stateless authentication across services |
| **bcrypt** | Password hashing |
| **http-proxy-middleware** | API Gateway reverse-proxy routing |

### Frontend
| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component-based UI library |
| **Vite 7** | Lightning-fast dev server & bundler |
| **React Router v7** | Client-side routing with role-based guards |
| **Axios** | HTTP client with JWT interceptor |
| **Socket.IO Client** | Real-time chat & notification listeners |
| **TailwindCSS 3** | Utility-first CSS framework |
| **Chart.js** | Admin dashboard analytics charts |
| **Lucide React** | Modern icon library |
| **React Hot Toast** | Toast notification system |

### Infrastructure
| Technology | Purpose |
| :--- | :--- |
| **Docker & Docker Compose** | Container orchestration for all services |
| **Nodemon** | Auto-restart during development |

---

## 🏛 Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         CLIENT  (React + Vite)                           │
│                          http://localhost:3000                           │
└──────────────────────────┬───────────────────────────────────────────────┘
                           │  All requests via /api/*
                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     API GATEWAY  (Express + Proxy)                      │
│                          http://localhost:5000                          │
│                                                                         │
│   /api/auth/*          → Auth Service       (PUBLIC  — no JWT needed)   │
│   /api/users/*         → User Service       (PROTECTED — JWT verified)  │
│   /api/connections/*   → Connection Service (PROTECTED — JWT verified)  │
│   /api/messages/*      → Chat Service       (PROTECTED — JWT verified)  │
│   /api/events/*        → Event Service      (PROTECTED — JWT verified)  │
└──┬──────────┬──────────┬──────────┬──────────┬──────────────────────────┘
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
┌──────┐ ┌──────┐ ┌──────────┐ ┌──────┐ ┌────────┐
│ Auth │ │ User │ │Connection│ │ Chat │ │  Event │    ← Each service owns
│:5001 │ │:5002 │ │  :5003   │ │:5004 │ │  :5005 │      its own database
└──┬───┘ └──┬───┘ └────┬─────┘ └──┬───┘ └────┬───┘
   │        │          │          │          │
   │        │          │  ┌───────┘          │
   ▼        ▼          ▼  ▼                  ▼
┌──────────────┐  ┌──────────┐          ┌──────────┐
│   MongoDB    │  │  Redis   │          │ RabbitMQ │
│  :27017      │  │  :6379   │          │  :5672   │
│              │  │  (Cache) │          │ (Broker) │
└──────────────┘  └──────────┘          └────┬─────┘
                                             │ Consume events
                                             ▼
                                    ┌─────────────────┐
                                    │  Notification   │
                                    │   Service       │
                                    │    :5006        │
                                    │                 │
                                    │ → message.new   │
                                    │ → connection.*  │
                                    │ → event.*       │
                                    └────────┬────────┘
                                             │ Socket.IO push
                                             ▼
                                        Client Browser
```

### How Data Flows

1. **User registers/logs in** → Frontend calls `/api/auth/*` → API Gateway forwards to **Auth Service** → JWT token returned to client.
2. **Authenticated requests** → Frontend sends JWT in `Authorization` header → API Gateway **verifies the token** → Proxies to the target microservice.
3. **Connection request sent** → Connection Service saves to its DB → Publishes `connection.requested` event to **RabbitMQ**.
4. **Chat message sent** → Chat Service persists message → Emits via **Socket.IO** for real-time delivery → Publishes `message.new` to **RabbitMQ**.
5. **Notification Service** → Listens on RabbitMQ queues → Receives events → Pushes real-time alerts to the target user's browser via **Socket.IO**.

---

## 📂 Project Structure

```
AlumniNetwork-Microservices/
│
├── api-gateway/                    # Central reverse-proxy & JWT gatekeeper
│   └── src/
│       ├── middleware/             # Auth middleware (JWT verification)
│       ├── proxy.js               # Proxy configuration
│       └── server.js              # Gateway entry point
│
├── auth-service/                   # Registration, Login, JWT issuance
│   └── src/
│       ├── config/                # MongoDB connection
│       ├── controllers/           # register, login, adminLogin, getMe
│       ├── middleware/            # protect middleware
│       ├── models/                # User schema (Mongoose)
│       ├── routes/                # /auth/* routes
│       ├── utils/                 # JWT helpers
│       └── server.js
│
├── user-service/                   # Profile CRUD, directory Search
│   └── src/
│       ├── cache/                 # Redis caching layer
│       ├── config/                # DB + Redis connection
│       ├── controllers/           # getAllAlumni, getAllStudents, updateProfile...
│       ├── models/                # User model
│       ├── routes/                # /users/* routes
│       └── server.js
│
├── connection-service/             # Connection request lifecycle
│   └── src/
│       ├── config/                # MongoDB connection
│       ├── controllers/           # sendRequest, acceptRequest, rejectRequest...
│       ├── events/                # RabbitMQ publisher
│       ├── models/                # Connection model
│       ├── routes/                # /connections/* routes
│       └── server.js
│
├── chat-service/                   # Real-time messaging engine
│   └── src/
│       ├── cache/                 # Redis chat cache
│       ├── config/                # DB + Redis connection
│       ├── controllers/           # getConversation, getInbox
│       ├── events/                # RabbitMQ publisher
│       ├── models/                # Message model
│       ├── routes/                # /messages/* routes
│       ├── socket/                # Socket.IO handler
│       └── server.js
│
├── event-service/                  # Event CRUD & RSVP
│   └── src/
│       ├── config/                # MongoDB connection
│       ├── controllers/           # createEvent, getEvents, updateEvent...
│       ├── events/                # RabbitMQ publisher
│       ├── models/                # Event model
│       ├── routes/                # /events/* routes
│       └── server.js
│
├── notification-service/           # Event-driven notification dispatcher
│   └── src/
│       ├── config/                # RabbitMQ config
│       ├── consumers/             # messageConsumer, connectionConsumer, eventConsumer
│       ├── socket/                # Socket.IO push handler
│       └── server.js
│
├── frontend/                       # React + Vite SPA
│   └── src/
│       ├── api/                   # Axios instance with JWT interceptor
│       ├── assets/                # Static assets
│       ├── Components/            # Reusable UI components
│       ├── Context/               # AuthContext (React Context API)
│       ├── hooks/                 # Custom React hooks
│       ├── Pages/
│       │   ├── Admin/             # AdminDashboard, ManageUsers, AdminEvents
│       │   ├── Alumni/            # Dashboard, Profile, Requests, Events, Chat
│       │   └── Student/           # Dashboard, Profile, Directory, Events, Messages
│       ├── App.jsx                # Router with ProtectedRoute guards
│       └── main.jsx               # App entry point
│
├── docker-compose.yml              # Full-stack container orchestration
├── start-all.bat                   # Windows: launch all services in separate terminals
├── stop-all.bat                    # Windows: kill all running services
├── .env.example                    # Template for environment variables
├── .gitignore                      # Ignores node_modules, .env, logs, archives
└── README.md                       # ← You are here
```

---

## ⚙️ Prerequisites

Make sure you have the following installed on your machine:

| Tool | Version | Download |
| :--- | :--- | :--- |
| **Node.js** | v16.x or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | v8.x or higher | Comes with Node.js |
| **Docker Desktop** | Latest | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

> **Note:** Docker is required to run MongoDB, Redis, and RabbitMQ. You can install them natively instead, but Docker is the recommended and easiest approach.

---

## 🚀 Getting Started

### Step 1 — Clone the Repository

```bash
git clone https://github.com/<YOUR_USERNAME>/AlumniNetwork-Microservices.git
cd AlumniNetwork-Microservices
```

### Step 2 — Start Infrastructure (MongoDB, Redis, RabbitMQ)

Open a terminal in the project root and run:

```bash
docker-compose up -d mongodb redis rabbitmq
```

Verify the containers are running:

```bash
docker ps
```

You should see three containers:
| Container | Port | Purpose |
| :--- | :--- | :--- |
| `mongodb` | `27017` | Primary database |
| `redis` | `6379` | Caching layer |
| `rabbitmq` | `5672` / `15672` | Message broker / Management UI |

> 💡 **RabbitMQ Dashboard:** Open [http://localhost:15672](http://localhost:15672) and login with `admin` / `admin123` to monitor message queues.

### Step 3 — Create `.env` Files

Since `.env` files are **not committed to Git** (for security), you need to create them manually in each service directory. Here are the exact values for local development:

<details>
<summary><b>📄 api-gateway/.env</b></summary>

```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
AUTH_SERVICE_URL=http://localhost:5001
USER_SERVICE_URL=http://localhost:5002
CONNECTION_SERVICE_URL=http://localhost:5003
CHAT_SERVICE_URL=http://localhost:5004
EVENT_SERVICE_URL=http://localhost:5005
```
</details>

<details>
<summary><b>📄 auth-service/.env</b></summary>

```env
PORT=5001
DB_URL=mongodb://127.0.0.1:27017/alumniDB
JWT_SECRET=your_jwt_secret_here
```
</details>

<details>
<summary><b>📄 user-service/.env</b></summary>

```env
PORT=5002
DB_URL=mongodb://127.0.0.1:27017/alumniDB
REDIS_URL=redis://localhost:6379
```
</details>

<details>
<summary><b>📄 connection-service/.env</b></summary>

```env
PORT=5003
DB_URL=mongodb://127.0.0.1:27017/alumniConnDB
RABBITMQ_URL=amqp://localhost
```
</details>

<details>
<summary><b>📄 chat-service/.env</b></summary>

```env
PORT=5004
DB_URL=mongodb://127.0.0.1:27017/alumniChatDB
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_here
```
</details>

<details>
<summary><b>📄 event-service/.env</b></summary>

```env
PORT=5005
DB_URL=mongodb://127.0.0.1:27017/alumniEventDB
RABBITMQ_URL=amqp://localhost
```
</details>

<details>
<summary><b>📄 notification-service/.env</b></summary>

```env
PORT=5006
RABBITMQ_URL=amqp://localhost
CLIENT_URL=http://localhost:3000
```
</details>

<details>
<summary><b>📄 frontend/.env</b></summary>

```env
VITE_API_URL=http://localhost:5000/api
```
</details>

> ⚠️ **Important:** The `JWT_SECRET` must be **identical** across `api-gateway`, `auth-service`, and `chat-service` — otherwise token verification will fail.

### Step 4 — Install Dependencies

Run `npm install` inside **every** service directory:

```bash
# Backend services
cd api-gateway          && npm install && cd ..
cd auth-service         && npm install && cd ..
cd user-service         && npm install && cd ..
cd connection-service   && npm install && cd ..
cd chat-service         && npm install && cd ..
cd event-service        && npm install && cd ..
cd notification-service && npm install && cd ..

# Frontend
cd frontend             && npm install && cd ..
```

### Step 5 — Launch All Services

#### Option A: One-Click Launch (Windows)

Simply double-click the **`start-all.bat`** file in the project root. This will open a separate terminal window for each service so you can monitor logs individually.

```
start-all.bat     ← double-click this
```

#### Option B: Manual Launch (Any OS)

Open **8 separate terminal** windows/tabs and run these commands:

```bash
# Terminal 1 — Auth Service
cd auth-service && npm run dev

# Terminal 2 — User Service
cd user-service && npm run dev

# Terminal 3 — Connection Service
cd connection-service && npm run dev

# Terminal 4 — Chat Service
cd chat-service && npm run dev

# Terminal 5 — Event Service
cd event-service && npm run dev

# Terminal 6 — Notification Service
cd notification-service && npm run dev

# Terminal 7 — API Gateway (start AFTER backend services)
cd api-gateway && npm run dev

# Terminal 8 — Frontend (start LAST)
cd frontend && npm run dev
```

### Step 6 — Open in Browser 🎉

| What | URL |
| :--- | :--- |
| **Frontend App** | [http://localhost:3000](http://localhost:3000) |
| **API Gateway** | [http://localhost:5000](http://localhost:5000) |
| **RabbitMQ Dashboard** | [http://localhost:15672](http://localhost:15672) |

---

## 🌐 API Endpoints

All endpoints are accessed through the **API Gateway** at `http://localhost:5000/api`.

### 🔐 Auth Service — `/api/auth`
> Public routes — no JWT required

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (student/alumni) |
| `POST` | `/api/auth/login` | Login and receive a JWT token |
| `POST` | `/api/auth/admin-login` | Admin-specific login |
| `GET` | `/api/auth/me` | Get current logged-in user (requires JWT) |

### 👤 User Service — `/api/users`
> 🔒 Protected — JWT required

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users/` | Get all users (Admin) |
| `GET` | `/api/users/alumni` | Get all alumni profiles |
| `GET` | `/api/users/students` | Get all student profiles |
| `GET` | `/api/users/:id` | Get a user by ID |
| `PUT` | `/api/users/profile` | Update own profile |
| `PUT` | `/api/users/:id/toggle-status` | Toggle user active/inactive (Admin) |
| `DELETE` | `/api/users/:id` | Delete a user (Admin) |

### 🤝 Connection Service — `/api/connections`
> 🔒 Protected — JWT required

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/connections/request/:userId` | Send a connection request |
| `PUT` | `/api/connections/accept/:connectionId` | Accept a connection request |
| `PUT` | `/api/connections/reject/:connectionId` | Reject a connection request |
| `GET` | `/api/connections/pending` | Get all pending requests |
| `GET` | `/api/connections/` | Get all active connections |
| `GET` | `/api/connections/status/:userId` | Check connection status with a user |

### 💬 Chat Service — `/api/messages`
> 🔒 Protected — JWT required

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/messages/` | Get inbox (all conversations) |
| `GET` | `/api/messages/:userId` | Get conversation with a specific user |

> Real-time messaging uses **Socket.IO** on port `5004` — not REST.

### 📅 Event Service — `/api/events`
> 🔒 Protected — JWT required

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/events/` | Create a new event |
| `GET` | `/api/events/` | Get all events |
| `GET` | `/api/events/:id` | Get event by ID |
| `PUT` | `/api/events/:id` | Update an event |
| `DELETE` | `/api/events/:id` | Delete an event |

---

## 🔑 Environment Variables

Quick reference for **every** variable used across all services:

| Variable | Used By | Description |
| :--- | :--- | :--- |
| `PORT` | All services | Port the service listens on |
| `DB_URL` | Auth, User, Connection, Chat, Event | MongoDB connection string |
| `JWT_SECRET` | API Gateway, Auth, Chat | Secret key for signing/verifying JWTs |
| `REDIS_URL` | User, Chat | Redis connection string |
| `RABBITMQ_URL` | Connection, Chat, Event, Notification | RabbitMQ broker URL |
| `CLIENT_URL` | API Gateway, Chat, Notification | Frontend origin for CORS |
| `AUTH_SERVICE_URL` | API Gateway | Internal URL of Auth Service |
| `USER_SERVICE_URL` | API Gateway | Internal URL of User Service |
| `CONNECTION_SERVICE_URL` | API Gateway | Internal URL of Connection Service |
| `CHAT_SERVICE_URL` | API Gateway | Internal URL of Chat Service |
| `EVENT_SERVICE_URL` | API Gateway | Internal URL of Event Service |
| `VITE_API_URL` | Frontend | API Gateway base URL |

---

## 🐳 Running with Docker

To run the **entire platform** (infrastructure + all services + frontend) with a single command:

```bash
docker-compose up --build
```

This will build and spin up all 11 containers. First build may take a few minutes.

To stop everything:
```bash
docker-compose down
```

To stop and **remove all data volumes** (fresh start):
```bash
docker-compose down -v
```

---

## 🧪 Health Checks

Every backend service exposes a `/health` endpoint. Use these to verify services are alive:

```bash
curl http://localhost:5000/health    # API Gateway
curl http://localhost:5001/health    # Auth Service
curl http://localhost:5002/health    # User Service
curl http://localhost:5003/health    # Connection Service
curl http://localhost:5004/health    # Chat Service
curl http://localhost:5005/health    # Event Service
curl http://localhost:5006/health    # Notification Service
```

Expected response:
```json
{ "status": "auth-service OK" }
```

---

## 🛡 Troubleshooting

<details>
<summary><b>❌ Services crash on startup with "ECONNREFUSED"</b></summary>

**Cause:** MongoDB, Redis, or RabbitMQ containers are not running.

**Fix:** Run the infrastructure first and wait for them to be healthy:
```bash
docker-compose up -d mongodb redis rabbitmq
docker ps   # verify all 3 are "Up"
```
Then start the microservices.
</details>

<details>
<summary><b>❌ "JWT malformed" or "invalid signature" errors</b></summary>

**Cause:** The `JWT_SECRET` values don't match across services.

**Fix:** Ensure the exact same `JWT_SECRET` string is set in:
- `api-gateway/.env`
- `auth-service/.env`
- `chat-service/.env`
</details>

<details>
<summary><b>❌ CORS errors in the browser console</b></summary>

**Cause:** The frontend is calling a microservice directly instead of through the API Gateway.

**Fix:**
1. Ensure `frontend/.env` has: `VITE_API_URL=http://localhost:5000/api`
2. Ensure `api-gateway/.env` has: `CLIENT_URL=http://localhost:3000`
3. Never call `:5001`, `:5002`, etc. from the frontend — always use `:5000`.
</details>

<details>
<summary><b>❌ Port already in use (EADDRINUSE)</b></summary>

**Cause:** A previous Node.js process is still running on that port.

**Fix (Windows):**
```bash
# Run stop-all.bat, or manually kill node processes:
taskkill /F /IM node.exe
```

**Fix (Mac/Linux):**
```bash
lsof -i :5001   # Find the PID
kill -9 <PID>   # Kill it
```
</details>

<details>
<summary><b>❌ Chat messages not showing in real-time</b></summary>

**Cause:** Socket.IO connection might not be established.

**Fix:**
1. Check that `chat-service` is running on port `5004`.
2. Ensure `CLIENT_URL` in `chat-service/.env` matches the frontend origin.
3. Check browser DevTools → Network → WS tab to see if the WebSocket connected.
</details>

<details>
<summary><b>❌ Notifications not being received</b></summary>

**Cause:** RabbitMQ consumers in the notification service may not have started.

**Fix:**
1. Verify RabbitMQ is running: [http://localhost:15672](http://localhost:15672)
2. Check the notification-service terminal for `RabbitMQ consumers started` log.
3. Restart the notification-service **after** RabbitMQ is fully initialized.
</details>

---

## 👥 User Roles & Access

| Role | Login Route | Dashboard | Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `/student/login` | `/student/dashboard` | Browse alumni directory, send connection requests, chat, view events |
| **Alumni** | `/alumni/login` | `/alumni/dashboard` | Manage profile, accept/reject requests, chat, create/view events |
| **Admin** | `/admin/login` | `/admin/dashboard` | Manage all users, manage events, view platform analytics |

---

## 🗺 Frontend Routes

| Path | Component | Access |
| :--- | :--- | :--- |
| `/` | Landing Page | Public |
| `/alumni/login` | Alumni Login | Public |
| `/alumni/signup` | Alumni Registration | Public |
| `/alumni/dashboard` | Alumni Dashboard | Alumni, Admin |
| `/alumni/profile` | Alumni Profile | Alumni, Admin |
| `/alumni/requests` | Connection Requests | Alumni, Admin |
| `/alumni/events` | Events Page | Alumni, Admin |
| `/alumni/chat` | Chat Interface | Alumni, Admin |
| `/student/login` | Student Login | Public |
| `/student/register` | Student Registration | Public |
| `/student/dashboard` | Student Dashboard | Student |
| `/student/profile` | Student Profile | Student |
| `/student/alumni` | Alumni Directory | Student |
| `/student/events` | Events Page | Student |
| `/student/messages` | Chat Interface | Student |
| `/admin/login` | Admin Login | Public |
| `/admin/dashboard` | Admin Dashboard | Admin |
| `/admin/users` | Manage Users | Admin |
| `/admin/events` | Manage Events | Admin |

---

<div align="center">

### Meet the Developers ❤️
### Aryan Bhagat - www.linkedin.com/in/aryanbhagat2708 <br>
### Suman Maharana - www.linkedin.com/in/suman-maharana-14a31a249

**If you found this helpful, give it a ⭐!**

</div>

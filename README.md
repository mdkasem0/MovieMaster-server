# 🎬 MovieMaster Pro – Backend (Express + MongoDB)

MovieMaster Pro Backend is a Node.js + Express server designed to handle movie data, user management, and watchlist functionality. It connects seamlessly with MongoDB Atlas and serves the frontend built with React.

---

## 🚀 Features

- RESTful API built with Express.js  
- MongoDB for persistent storage  
- User management with upsert functionality  
- CRUD operations for movies and collections  
- Watchlist management for users  
- CORS-enabled for frontend integration  
- Secure environment variables using dotenv  

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Backend framework |
| **MongoDB** | Database |
| **Dotenv** | Environment variable management |
| **Cors** | Cross-origin resource sharing |

## 🧩 API Endpoints

### 🧍‍♂️ Users

| Method | Endpoint        | Description                 |
|--------|----------------|-----------------------------|
| PUT    | `/users/:email` | Create or update a user     |
| GET    | `/users/:email` | Get user info by email      |

---

### 🎥 Movies

| Method | Endpoint               | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | `/movies`             | Add a new movie                     |
| GET    | `/movies`             | Get all movies                      |
| GET    | `/movies/:id`         | Get single movie details            |
| PUT    | `/movies/:id`         | Update a movie                      |
| DELETE | `/movies/:id`         | Delete a movie                      |
| GET    | `/movies/top-rated`   | Get top 6 highest-rated movies     |
| GET    | `/movies/genre/:genre` | Get movies filtered by genre        |

---

### ⭐ Watchlist

| Method | Endpoint           | Description                  |
|--------|------------------|------------------------------|
| POST   | `/watchlist`       | Add movie to watchlist       |
| GET    | `/watchlist/:email`| Get user’s watchlist         |
| DELETE | `/watchlist/:id`   | Remove movie from watchlist  |

---

### 📊 Platform Statistics

| Method | Endpoint  | Description                                                   |
|--------|-----------|---------------------------------------------------------------|
| GET    | `/stats`  | Returns total movies, total users, top-rated movie, awards   |


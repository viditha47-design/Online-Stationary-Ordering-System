# Technical Documentation
## Campus Stationery Online Ordering System

**Version:** 1.0  
**Date:** April 2026

---

## 1. System Architecture

The application follows a client-server architecture using the MERN stack.

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (React)                    │
│         Vite + React Router + Axios                  │
│              http://localhost:5173                   │
└─────────────────────────┬───────────────────────────┘
                          │ HTTP REST API
┌─────────────────────────▼───────────────────────────┐
│                SERVER (Node.js + Express)            │
│              http://localhost:5000                   │
│   /api/auth  /api/orders  /api/items                 │
│   /api/notifications  /api/announcements             │
│   /api/profile  /api/reports                         │
└─────────────────────────┬───────────────────────────┘
                          │ Mongoose ODM
┌─────────────────────────▼───────────────────────────┐
│                  DATABASE (MongoDB)                  │
│   Collections: users, orders, items,                 │
│   notifications, announcements                       │
└─────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | 19.x |
| Frontend Build Tool | Vite | 8.x |
| Routing | React Router DOM | 7.x |
| HTTP Client | Axios | 1.x |
| Toast Notifications | React Hot Toast | 2.x |
| Backend Framework | Express.js | 4.x |
| Runtime | Node.js | 22.x |
| Database | MongoDB | 8.x |
| ODM | Mongoose | 7.x |
| Authentication | JSON Web Token (JWT) | 9.x |
| Password Hashing | bcryptjs | 2.x |
| File Uploads | Multer | 1.x |
| Environment Config | dotenv | 16.x |

---

## 3. Project Structure

```
stationery-app/
├── client/                        # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Top navigation bar
│   │   │   ├── AnnouncementBanner.jsx
│   │   │   └── NotificationBell.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── PlaceOrder.jsx
│   │   │   │   └── MyOrders.jsx
│   │   │   └── staff/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManageItems.jsx
│   │   │       ├── OrderHistory.jsx
│   │   │       ├── Reports.jsx
│   │   │       └── Announcements.jsx
│   │   ├── App.jsx                # Routes definition
│   │   ├── main.jsx               # Entry point
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                        # Express backend
    ├── models/
    │   ├── User.js
    │   ├── Item.js
    │   ├── Order.js
    │   ├── Notification.js
    │   └── Announcement.js
    ├── routes/
    │   ├── auth.js
    │   ├── items.js
    │   ├── orders.js
    │   ├── notifications.js
    │   ├── announcements.js
    │   ├── profile.js
    │   └── reports.js
    ├── middleware/
    │   └── auth.js                # JWT verification + role guard
    ├── uploads/                   # Uploaded print files (auto-created)
    ├── index.js                   # Server entry point
    ├── seed.js                    # Database seeder
    ├── .env
    └── package.json
```

---

## 4. Database Schema

### 4.1 User
```js
{
  name:      String (required),
  email:     String (required, unique),
  password:  String (hashed, required),
  role:      Enum ['student', 'staff'] (default: 'student'),
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 Item
```js
{
  name:        String (required),
  description: String,
  price:       Number (required),
  stock:       Number (default: 0),
  category:    Enum ['general','paper','writing','binding','other'],
  imageUrl:    String,
  createdAt:   Date,
  updatedAt:   Date
}
```

### 4.3 Order
```js
{
  student:         ObjectId → User (required),
  type:            Enum ['stationery', 'print', 'mixed'],
  items: [{
    item:          ObjectId → Item,
    quantity:      Number
  }],
  printJobs: [{
    filename:      String,
    originalName:  String,
    copies:        Number,
    colorMode:     Enum ['black_white', 'color'],
    pageSize:      Enum ['A4', 'A3', 'Letter'],
    doubleSided:   Boolean
  }],
  status:          Enum ['pending','processing','ready','collected','cancelled'],
  totalAmount:     Number,
  notes:           String,
  staffNote:       String,
  estimatedPickup: Date,
  preferredPickup: String,
  rating:          Number (1-5),
  feedback:        String,
  createdAt:       Date,
  updatedAt:       Date
}
```

### 4.4 Notification
```js
{
  user:      ObjectId → User (required),
  message:   String (required),
  read:      Boolean (default: false),
  orderId:   ObjectId → Order,
  createdAt: Date
}
```

### 4.5 Announcement
```js
{
  message:   String (required),
  type:      Enum ['info', 'warning', 'success'],
  active:    Boolean (default: true),
  createdBy: ObjectId → User,
  createdAt: Date
}
```

---

## 5. API Reference

### Authentication — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /register | No | Register new user |
| POST | /login | No | Login and get JWT token |

### Items — `/api/items`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | No | Get all items |
| POST | / | Staff | Add new item |
| PUT | /:id | Staff | Update item |
| DELETE | /:id | Staff | Delete item |

### Orders — `/api/orders`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | / | Student | Place new order |
| GET | /my | Student | Get own orders |
| GET | /all | Staff | Get all orders |
| PUT | /:id/status | Staff | Update order status |
| PUT | /:id/cancel | Student | Cancel pending order |
| PUT | /:id/rate | Student | Rate collected order |
| GET | /:id/reorder | Student | Get order for reorder |

### Notifications — `/api/notifications`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | Any | Get my notifications |
| PUT | /read-all | Any | Mark all as read |
| PUT | /:id/read | Any | Mark one as read |

### Announcements — `/api/announcements`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | No | Get active announcements |
| GET | /all | Staff | Get all announcements |
| POST | / | Staff | Create announcement |
| PUT | /:id | Staff | Update announcement |
| DELETE | /:id | Staff | Delete announcement |

### Profile — `/api/profile`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | / | Any | Get profile |
| PUT | / | Any | Update name |
| PUT | /password | Any | Change password |

### Reports — `/api/reports`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /summary | Staff | Get summary report (today/week/month) |

---

## 6. Authentication Flow

```
1. User submits login form
2. POST /api/auth/login with { email, password }
3. Server verifies password with bcrypt
4. Server signs JWT: { id, role } with 7-day expiry
5. Client stores token in localStorage
6. All subsequent requests include: Authorization: Bearer <token>
7. authMiddleware verifies token on protected routes
8. staffOnly middleware checks role === 'staff'
```

---

## 7. File Upload Flow

```
1. Student selects files on PlaceOrder page
2. Files sent as multipart/form-data via POST /api/orders
3. Multer saves files to server/uploads/ with timestamp prefix
4. Filename stored in order's printJobs array
5. Staff accesses file via: GET /uploads/<filename>
```

---

## 8. Stock Management Flow

```
Order Placed:
  For each item in order:
    Check item.stock >= requested quantity
    If not → reject order with error message
    If yes → item.stock -= quantity → save

Order Cancelled:
  For each item in order:
    item.stock += quantity → save (via $inc)
```

---

## 9. Environment Variables

File: `server/.env`

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/stationery_app
JWT_SECRET=your_jwt_secret_key_change_this
```

---

## 10. Setup & Installation

```bash
# 1. Install and start MongoDB

# 2. Backend setup
cd stationery-app/server
npm install
node seed.js        # seed 12 sample items (run once)
npm run dev         # starts on http://localhost:5000

# 3. Frontend setup
cd stationery-app/client
npm install
npm run dev         # starts on http://localhost:5173
```

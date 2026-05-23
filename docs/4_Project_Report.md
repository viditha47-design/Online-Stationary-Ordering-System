# Project Report
## Campus Stationery Online Ordering System

**Submitted to:** VNR Vignana Jyothi Institute of Engineering and Technology  
**Department:** Computer Science and Engineering  
**Academic Year:** 2025–2026  
**Date:** April 2026

---

## Abstract

The Campus Stationery Online Ordering System is a web-based application developed to address the problem of long waiting queues at the college stationery shop. Students frequently face delays when visiting the shop to print documents or purchase stationery items, especially during peak academic periods. This system allows students to place orders online in advance using their college email, enabling the stationery staff to prepare orders before the student arrives. The application is built using the MERN stack (MongoDB, Express.js, React, Node.js) and provides separate interfaces for students and staff with role-based access control, real-time order tracking, inventory management, notifications, and analytics.

---

## 1. Introduction

### 1.1 Background
College stationery shops serve hundreds of students daily. Students need to print assignments, projects, and other documents, and also purchase stationery items such as pens, notebooks, and binding materials. The current manual process requires students to physically visit the shop, stand in queues, submit their requests, and wait for the order to be processed. This leads to significant time wastage, especially during examination periods when demand is highest.

### 1.2 Problem Statement
The existing manual system at the VNR VJIET stationery shop suffers from the following issues:
- Long waiting queues during peak hours
- Overcrowding at the shop counter
- Inefficient order processing without advance preparation
- No way for students to track order status
- No inventory visibility for students (out-of-stock items discovered only at the counter)
- Poor time management for both students and staff

### 1.3 Objectives
The primary objectives of this project are:
1. To develop an online platform for students to place stationery and print orders in advance
2. To enable stationery staff to receive, process, and manage orders efficiently
3. To reduce waiting time and overcrowding at the stationery shop
4. To provide real-time order status tracking for students
5. To automate inventory management with stock tracking
6. To improve communication between students and staff through notifications and announcements

### 1.4 Scope
The system covers:
- Online ordering of stationery items and printing services
- Role-based access for students and staff
- Order lifecycle management from placement to collection
- Inventory management with automatic stock updates
- In-app notifications and announcements
- Analytics and reporting for staff

---

## 2. Literature Review

### 2.1 Existing Systems
Several institutions have implemented online ordering systems for campus services. Common approaches include:
- **Email-based ordering:** Students email their requests, which is informal and untracked
- **WhatsApp ordering:** Informal, no order management or tracking
- **Generic e-commerce platforms:** Not tailored for campus stationery needs

### 2.2 Limitations of Existing Approaches
- No structured order tracking
- No inventory management
- No role-based access
- Not integrated with college email authentication
- No analytics for shop management

### 2.3 Proposed Solution
A dedicated web application built specifically for campus stationery needs, with college email-based authentication, structured order management, real-time tracking, and staff management tools.

---

## 3. System Design

### 3.1 Architecture
The system uses a three-tier client-server architecture:

**Presentation Layer (Frontend)**
- Built with React 19 and Vite
- Single Page Application (SPA) with React Router
- Responsive design for desktop and mobile

**Application Layer (Backend)**
- Node.js with Express.js REST API
- JWT-based authentication
- Multer for file upload handling
- Mongoose for database operations

**Data Layer (Database)**
- MongoDB document database
- Five collections: users, items, orders, notifications, announcements

### 3.2 Data Flow

```
Student places order
       ↓
Frontend validates input
       ↓
POST /api/orders (with files if print)
       ↓
Backend checks stock availability
       ↓
Stock deducted from inventory
       ↓
Order saved to database
       ↓
Notification created for student
       ↓
Staff sees order on dashboard
       ↓
Staff updates status → notification sent
       ↓
Student sees status update
       ↓
Student collects order → marks collected
       ↓
Student rates the service
```

### 3.3 Entity Relationship

```
User (1) ──────── (many) Order
User (1) ──────── (many) Notification
User (1) ──────── (many) Announcement
Order (many) ──── (many) Item
Order (1) ─────── (many) PrintJob
Order (1) ─────── (many) Notification
```

### 3.4 Module Design

| Module | Description |
|--------|-------------|
| Authentication | Registration, login, JWT issuance, role validation |
| Order Management | Place, track, cancel, rate, reorder |
| Inventory | CRUD operations on items, stock management |
| Notifications | Auto-create on order events, mark as read |
| Announcements | Post, activate/deactivate, display to users |
| Reports | Aggregate order and revenue data |
| Profile | Update name, change password |

---

## 4. Implementation

### 4.1 Technology Choices

**React** was chosen for the frontend due to its component-based architecture, which allows reusable UI components across student and staff interfaces. React Router enables client-side navigation without page reloads.

**Node.js with Express** was chosen for the backend due to its non-blocking I/O model, which handles concurrent requests efficiently. Express provides a minimal and flexible routing framework.

**MongoDB** was chosen as the database because the document model naturally fits the nested structure of orders (which contain arrays of items and print jobs). It also allows flexible schema evolution.

**JWT** was chosen for authentication because it is stateless, meaning the server does not need to store session data. The token carries the user's ID and role, enabling role-based access control on every request.

### 4.2 Key Implementation Details

#### Email-Based Role Validation
Students are required to register with @vnrvjiet.in email addresses. This is enforced on the backend:
```js
const isCollegeMail = email.endsWith('@vnrvjiet.in');
if (role === 'student' && !isCollegeMail) → reject
if (role === 'staff' && isCollegeMail) → reject
```

#### Atomic Stock Management
When an order is placed, stock is checked and deducted for each item before the order is saved. If any item has insufficient stock, the entire operation is rejected and no stock is deducted.

#### File Upload Handling
Print documents are uploaded using Multer with disk storage. Files are saved with a timestamp prefix to avoid naming conflicts. The server exposes the uploads directory as a static file server so staff can download files directly.

#### Real-Time Notifications
Notifications are created automatically on the server when order status changes. The frontend polls the notifications API every 30 seconds to check for new notifications, displaying an unread count badge on the bell icon.

### 4.3 Security Measures
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens expire after 7 days
- All protected routes require valid JWT
- Staff-only routes additionally check role === 'staff'
- File uploads limited to 10MB
- CORS enabled for cross-origin requests

---

## 5. Features Implemented

### 5.1 Student Features
| Feature | Description |
|---------|-------------|
| Registration | College email validation (@vnrvjiet.in) |
| Stationery ordering | Browse, search, filter by category, add to cart |
| Print ordering | Upload documents with print settings |
| Mixed ordering | Combine stationery and print in one order |
| Preferred pickup | Select morning/afternoon/evening slot |
| Order tracking | View status with filter and search |
| Order cancellation | Cancel pending orders with stock restore |
| Reorder | One-click reorder from previous orders |
| Rating | 1-5 star rating with feedback on collected orders |
| Notifications | Real-time status update notifications |
| Profile | Update name and change password |
| Announcements | View shop notices and alerts |

### 5.2 Staff Features
| Feature | Description |
|---------|-------------|
| Order dashboard | View all orders with status counts |
| Status management | Update order status with notifications |
| Staff notes | Add instructions or comments to orders |
| Estimated pickup | Set expected ready time for students |
| File download | Access uploaded print documents |
| Inventory management | Add, edit, delete items with stock |
| Low stock alerts | Visual warnings for low/zero stock |
| Order history | Full history with search and date filter |
| Reports | Revenue, order counts, top items, low stock |
| Announcements | Post, manage notices for students |

---

## 6. Testing

### 6.1 Functional Testing

| Test Case | Input | Expected Output | Result |
|-----------|-------|-----------------|--------|
| Student registration with college email | @vnrvjiet.in email | Account created | Pass |
| Student registration with personal email | @gmail.com email | Error: must use college email | Pass |
| Staff registration with college email | @vnrvjiet.in email | Error: must use personal email | Pass |
| Login with correct credentials | Valid email/password | JWT token returned | Pass |
| Login with wrong password | Wrong password | Invalid credentials error | Pass |
| Place order with sufficient stock | 2 pens (stock: 200) | Order placed, stock = 198 | Pass |
| Place order with insufficient stock | 300 pens (stock: 200) | Insufficient stock error | Pass |
| Cancel pending order | Pending order | Cancelled, stock restored | Pass |
| Cancel non-pending order | Processing order | Error: only pending can cancel | Pass |
| Staff update order status | Processing → Ready | Status updated, notification sent | Pass |
| Rate collected order | 5 stars | Rating saved | Pass |
| Rate non-collected order | Pending order | Error: only collected can rate | Pass |

### 6.2 Security Testing

| Test Case | Expected Result | Result |
|-----------|-----------------|--------|
| Access student route as staff | Redirect to home | Pass |
| Access staff route as student | Redirect to home | Pass |
| Access protected route without token | 401 Unauthorized | Pass |
| Access staff API without staff role | 403 Forbidden | Pass |

---

## 7. Results and Discussion

The system successfully addresses all the stated objectives:

1. **Reduced waiting time:** Students can place orders in advance and collect them without waiting in queues
2. **Improved efficiency:** Staff can prepare orders before students arrive, reducing counter time
3. **Real-time tracking:** Students know exactly when their order is ready through notifications
4. **Inventory control:** Automatic stock management prevents overselling and provides low stock alerts
5. **Better communication:** Announcements and notifications keep students informed
6. **Data insights:** Reports help staff understand demand patterns and manage inventory proactively

---

## 8. Conclusion

The Campus Stationery Online Ordering System successfully digitizes the stationery shop ordering process at VNR VJIET. The application provides a seamless experience for students to place orders online and for staff to manage them efficiently. The system reduces physical queues, improves time management, and enhances communication between students and the stationery shop.

The MERN stack proved to be an effective choice for this application, providing a consistent JavaScript environment across frontend and backend, rapid development capability, and flexible data modeling.

---

## 9. Future Enhancements

| Enhancement | Description |
|-------------|-------------|
| Payment integration | Online payment via UPI/Razorpay |
| Email notifications | Send email alerts on status changes |
| Push notifications | Browser push notifications |
| Mobile app | React Native mobile application |
| Print cost calculator | Auto-calculate print cost based on pages and settings |
| QR code pickup | Generate QR code for order pickup verification |
| Bulk stock import | Upload CSV to update multiple item stocks |
| Student ID verification | Verify roll number format during registration |

---

## 10. References

1. MongoDB Documentation — https://www.mongodb.com/docs
2. Express.js Documentation — https://expressjs.com
3. React Documentation — https://react.dev
4. Node.js Documentation — https://nodejs.org/docs
5. JSON Web Tokens — https://jwt.io
6. Multer File Upload — https://github.com/expressjs/multer
7. React Router — https://reactrouter.com
8. Vite Build Tool — https://vitejs.dev

---

## Appendix A: System Screenshots Description

1. **Login Page** — Clean login form with email and password fields
2. **Register Page** — Registration form with role selection and email hints
3. **Student Dashboard** — Welcome screen with quick access cards
4. **Place Order Page** — Tabbed interface for stationery/print/mixed orders with search and category filter
5. **My Orders Page** — Order history with status cards, search, and filter
6. **Staff Dashboard** — Order management with status update controls
7. **Manage Items Page** — Inventory table with add/edit/delete form
8. **Reports Page** — Analytics with summary cards and bar charts
9. **Announcements Page** — Announcement management interface
10. **Profile Page** — Name update and password change forms

---

## Appendix B: Team Contributions

| Task | Description |
|------|-------------|
| Backend Development | REST API, authentication, order management, stock logic |
| Frontend Development | React UI, routing, state management |
| Database Design | Schema design, relationships, indexing |
| Testing | Functional and security testing |
| Documentation | SRS, technical docs, user manual, project report |

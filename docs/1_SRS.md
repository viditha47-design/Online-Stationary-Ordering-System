# Software Requirements Specification (SRS)
## Campus Stationery Online Ordering System

**Version:** 1.0  
**Date:** April 2026  
**Institution:** VNR Vignana Jyothi Institute of Engineering and Technology

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the Campus Stationery Online Ordering System. It describes the functional and non-functional requirements for the web application that allows students to place stationery and print orders online and enables staff to manage and fulfill those orders.

### 1.2 Scope
The system is a web-based application accessible via any modern browser. It serves two types of users — students and stationery shop staff. Students can place orders for stationery items and printing services in advance. Staff can manage inventory, process orders, and communicate with students through the platform.

### 1.3 Definitions and Acronyms
| Term | Definition |
|------|-----------|
| SRS | Software Requirements Specification |
| JWT | JSON Web Token — used for authentication |
| API | Application Programming Interface |
| MERN | MongoDB, Express, React, Node.js stack |
| Stock | Quantity of a stationery item available in the shop |
| Order | A request placed by a student for items or printing |

### 1.4 Overview
The rest of this document covers overall system description, functional requirements, non-functional requirements, and system constraints.

---

## 2. Overall Description

### 2.1 Product Perspective
The system replaces the manual, queue-based process at the college stationery shop. Students currently must physically visit the shop, wait in queues, and wait again for their order to be processed. This system allows students to place orders online in advance so that orders are ready for pickup when they arrive.

### 2.2 Product Functions
- User registration and authentication with role-based access
- Online ordering of stationery items
- Document upload for printing with configurable print settings
- Real-time order status tracking
- Inventory management for staff
- Notifications, announcements, and reporting

### 2.3 User Classes

**Students**
- Register using their college email (@vnrvjiet.in)
- Place, track, cancel, and reorder stationery/print orders
- Rate completed orders and receive status notifications

**Staff**
- Register using a personal email
- Manage inventory, process orders, post announcements
- View reports and order history

### 2.4 Operating Environment
- Client: Any modern web browser (Chrome, Firefox, Edge, Safari)
- Server: Node.js v16+ running on Windows/Linux
- Database: MongoDB 6+
- Network: Local network or internet connection

### 2.5 Assumptions and Dependencies
- MongoDB must be installed and running
- Node.js must be installed on the server machine
- Students must have a valid @vnrvjiet.in email address
- The system is intended for use within the college campus

---

## 3. Functional Requirements

### 3.1 Authentication Module

| ID | Requirement |
|----|-------------|
| FR-01 | The system shall allow users to register with name, email, password, and role |
| FR-02 | Students must register with an @vnrvjiet.in email address |
| FR-03 | Staff must register with a non-college personal email |
| FR-04 | The system shall authenticate users using email and password |
| FR-05 | The system shall issue a JWT token upon successful login |
| FR-06 | The system shall restrict access to pages based on user role |
| FR-07 | Users shall be able to log out and invalidate their session |

### 3.2 Order Management Module

| ID | Requirement |
|----|-------------|
| FR-08 | Students shall be able to place stationery orders by selecting items and quantities |
| FR-09 | Students shall be able to upload documents for printing |
| FR-10 | Print orders shall support settings: copies, color mode (B&W/color), page size (A4/A3/Letter), double-sided |
| FR-11 | Students shall be able to place mixed orders (stationery + print) |
| FR-12 | Students shall be able to select a preferred pickup time slot |
| FR-13 | The system shall deduct stock when an order is placed |
| FR-14 | The system shall reject orders if stock is insufficient |
| FR-15 | Students shall be able to cancel pending orders |
| FR-16 | Stock shall be restored when an order is cancelled |
| FR-17 | Students shall be able to reorder from a previous order |
| FR-18 | Students shall be able to rate and leave feedback on collected orders |

### 3.3 Order Tracking Module

| ID | Requirement |
|----|-------------|
| FR-19 | Students shall be able to view all their orders with status |
| FR-20 | Students shall be able to filter orders by status and search by order ID |
| FR-21 | Staff shall be able to view all orders and filter by status |
| FR-22 | Staff shall be able to update order status |
| FR-23 | Staff shall be able to add notes to orders |
| FR-24 | Staff shall be able to set an estimated pickup time |
| FR-25 | The system shall notify students when their order status changes |

### 3.4 Inventory Management Module

| ID | Requirement |
|----|-------------|
| FR-26 | Staff shall be able to add new stationery items with name, price, stock, category |
| FR-27 | Staff shall be able to edit existing items |
| FR-28 | Staff shall be able to delete items |
| FR-29 | The system shall display low stock warnings when stock falls below 10 |
| FR-30 | The system shall display out-of-stock items as unavailable to students |

### 3.5 Notification Module

| ID | Requirement |
|----|-------------|
| FR-31 | The system shall create a notification when an order is placed |
| FR-32 | The system shall create a notification when order status changes |
| FR-33 | Users shall be able to view their notifications via a bell icon |
| FR-34 | Users shall be able to mark notifications as read |

### 3.6 Announcement Module

| ID | Requirement |
|----|-------------|
| FR-35 | Staff shall be able to post announcements with type (info/warning/success) |
| FR-36 | Active announcements shall be displayed as a banner to all logged-in users |
| FR-37 | Staff shall be able to activate, deactivate, or delete announcements |
| FR-38 | Users shall be able to dismiss announcement banners |

### 3.7 Reports Module

| ID | Requirement |
|----|-------------|
| FR-39 | Staff shall be able to view total orders and revenue for today/week/month |
| FR-40 | Staff shall be able to view orders grouped by status |
| FR-41 | Staff shall be able to view the top 5 most ordered items |
| FR-42 | Staff shall be able to view items with low stock |

### 3.8 Profile Module

| ID | Requirement |
|----|-------------|
| FR-43 | Users shall be able to update their display name |
| FR-44 | Users shall be able to change their password |

---

## 4. Non-Functional Requirements

### 4.1 Performance
- The system shall load pages within 3 seconds under normal network conditions
- The API shall respond to requests within 1 second for standard operations

### 4.2 Security
- Passwords shall be hashed using bcrypt before storage
- All protected routes shall require a valid JWT token
- Role-based access control shall prevent unauthorized access
- File uploads shall be limited to 10MB per file

### 4.3 Usability
- The interface shall be intuitive and require no training for basic use
- The application shall be responsive and usable on mobile browsers
- Error messages shall be clear and descriptive

### 4.4 Reliability
- The system shall handle invalid inputs gracefully without crashing
- Stock operations shall be atomic to prevent overselling

### 4.5 Maintainability
- The codebase shall follow a modular MVC-style structure
- Backend routes shall be separated by feature module
- Frontend pages shall be organized by user role

---

## 5. System Constraints
- The system requires an active MongoDB instance
- File uploads are stored locally on the server filesystem
- The system does not currently support online payment
- Email notifications are not implemented (in-app only)

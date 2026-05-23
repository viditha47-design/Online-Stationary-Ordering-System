# Campus Stationery Online System

## Prerequisites
- Node.js v16+
- MongoDB (running locally on port 27017)

## Setup & Run

### 1. Backend
```bash
cd server
npm install
# Optional: seed sample stationery items
node seed.js
npm run dev
```
Server runs on http://localhost:5000

### 2. Frontend
```bash
cd client
npm install
npm run dev
```
App runs on http://localhost:5173

## Usage

### Students
1. Register with role "Student"
2. Login and place orders — select stationery items, upload print documents, or both
3. Track order status in "My Orders"
4. Cancel pending orders if needed

### Staff
1. Register with role "Staff" (or create via seed)
2. Login to view all incoming orders
3. Update order status: pending → processing → ready → collected
4. Add notes to orders
5. Manage stationery inventory in "Manage Items"

## Features
- JWT authentication (student & staff roles)
- Order stationery items with quantity selection
- Upload documents for printing (PDF, DOC, images)
- Print settings: copies, color mode, page size, double-sided
- Real-time order status tracking
- Staff dashboard with order counts by status
- File download for staff to access uploaded documents

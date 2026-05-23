# User Manual
## Campus Stationery Online Ordering System

**Version:** 1.0  
**Date:** April 2026

---

## Table of Contents
1. [Getting Started](#1-getting-started)
2. [Student Guide](#2-student-guide)
3. [Staff Guide](#3-staff-guide)
4. [Troubleshooting](#4-troubleshooting)

---

## 1. Getting Started

### 1.1 Accessing the Application
Open your web browser and navigate to: `http://localhost:5173`

### 1.2 Registration

**For Students:**
1. Click "Register" on the login page
2. Fill in your details:
   - Full Name
   - College Email (must end with @vnrvjiet.in)
   - Password (minimum 6 characters)
   - Select role: **Student**
3. Click "Register"
4. You'll be automatically logged in

**For Staff:**
1. Click "Register" on the login page
2. Fill in your details:
   - Full Name
   - Personal Email (must NOT be @vnrvjiet.in)
   - Password
   - Select role: **Staff**
3. Click "Register"

### 1.3 Login
1. Enter your email and password
2. Click "Sign In"
3. You'll be redirected to your dashboard

---

## 2. Student Guide

### 2.1 Dashboard
After logging in, you'll see your dashboard with quick access cards:
- **Place New Order** — Start a new stationery or print order
- **My Orders** — View and track all your orders
- **My Profile** — Update your name or change password

### 2.2 Placing an Order

#### Step 1: Choose Order Type
Click "Place New Order" and select:
- **🛒 Stationery** — Order stationery items only
- **🖨️ Print** — Upload documents for printing only
- **📦 Both** — Order stationery and print together

#### Step 2A: Ordering Stationery Items
1. Use the search bar to find items by name
2. Use the category dropdown to filter by type (general, paper, writing, binding, other)
3. Click **+** to add items to your cart
4. Click **−** to reduce quantity
5. Out-of-stock items are shown in red and cannot be added
6. Your total amount is displayed at the bottom

#### Step 2B: Uploading Print Documents
1. Click "Choose Files" to select documents
2. Supported formats: PDF, DOC, DOCX, PNG, JPG
3. Configure print settings:
   - **Copies:** Number of copies per document
   - **Color:** Black & White or Color
   - **Size:** A4, A3, or Letter
   - **Double-sided:** Check the box if needed
4. All uploaded files will use the same settings

#### Step 3: Select Pickup Time (Optional)
Choose your preferred pickup slot:
- Morning (9am-11am)
- Afternoon (12pm-2pm)
- Evening (3pm-5pm)

#### Step 4: Add Notes (Optional)
Enter any special instructions in the "Additional Notes" field.

#### Step 5: Submit
Click "Place Order" to submit. You'll receive a confirmation and be redirected to "My Orders".

### 2.3 Tracking Orders

#### Viewing Your Orders
1. Go to "My Orders" from the navigation bar
2. You'll see all your orders with their current status

#### Order Status Meanings
- **Pending** — Order received, waiting to be processed
- **Processing** — Staff is preparing your order
- **Ready** — Your order is ready for pickup
- **Collected** — You've picked up your order
- **Cancelled** — Order was cancelled

#### Filtering Orders
- Click on any status card at the top to filter by that status
- Use the search bar to find orders by ID or type
- Use the dropdown to filter by specific status

#### Order Details
Each order card shows:
- Order ID (6-character code)
- Order type (stationery/print/mixed)
- Items ordered with quantities
- Print jobs with settings
- Total amount
- Your notes
- Staff notes (if any)
- Preferred pickup time (if selected)
- Estimated ready time (set by staff)
- Order date

### 2.4 Cancelling an Order
1. Find the order in "My Orders"
2. Only **Pending** orders can be cancelled
3. Click the "Cancel" button
4. Stock will be automatically restored

### 2.5 Reordering
1. Find a completed or cancelled order
2. Click the "🔄 Reorder" button
3. You'll be taken to the order page with items pre-filled
4. Adjust quantities if needed and submit

### 2.6 Rating an Order
1. After an order is marked as **Collected**
2. Click the "⭐ Rate" button
3. Select 1-5 stars
4. Optionally leave a comment
5. Click "Submit"

### 2.7 Notifications
- Click the 🔔 bell icon in the top navigation
- You'll see notifications for:
  - Order placed confirmation
  - Status changes (processing, ready, collected)
- Unread notifications show a red badge with count
- Click "Mark all read" to clear the badge

### 2.8 Profile Management
1. Click your name in the top navigation or go to "My Profile"
2. **Update Name:**
   - Enter new name
   - Click "Save"
3. **Change Password:**
   - Enter current password
   - Enter new password
   - Confirm new password
   - Click "Update Password"

### 2.9 Announcements
- Active announcements appear as a banner at the top
- Different colors indicate type:
  - Blue (ℹ️) — Information
  - Yellow (⚠️) — Warning
  - Green (✅) — Success
- Click the ✕ to dismiss a banner

---

## 3. Staff Guide

### 3.1 Dashboard
After logging in, you'll see:
- **Order count cards** by status (pending, processing, ready, collected, cancelled)
- **Filter dropdown** to view orders by status
- **Refresh button** to reload orders
- **List of all orders** with details

### 3.2 Managing Orders

#### Viewing Orders
- All incoming orders are displayed on the dashboard
- Each order shows:
  - Order ID
  - Student name and email
  - Order type
  - Items/print jobs
  - Student notes
  - Preferred pickup time
  - Total amount
  - Order date

#### Updating Order Status
1. Find the order
2. Use the status dropdown at the bottom of the order card
3. Select new status:
   - **Pending** → **Processing** (you're working on it)
   - **Processing** → **Ready** (order is ready for pickup)
   - **Ready** → **Collected** (student picked it up)
   - Or **Cancelled** if needed
4. Status updates automatically notify the student

#### Adding Staff Notes
1. Type your note in the "Add staff note..." field
2. Change the status to save the note
3. Students will see your note on their order

#### Setting Estimated Pickup Time
1. Click the "Est. Pickup Time" datetime field
2. Select date and time when order will be ready
3. Change status to save
4. Students will see "Ready by: [time]" on their order

#### Downloading Print Files
- For print orders, click the **[Download]** link next to each file
- Files open in a new tab for viewing or downloading

### 3.3 Managing Inventory

#### Viewing Items
1. Go to "Manage Items" from the navigation
2. You'll see a table of all stationery items with:
   - Name and description
   - Category
   - Price
   - Current stock (red if 0, orange if < 5)

#### Adding New Items
1. Fill in the form at the top:
   - Item name (required)
   - Description (optional)
   - Price in ₹ (required)
   - Stock quantity (required)
   - Category (general/paper/writing/binding/other)
2. Click "Add Item"

#### Editing Items
1. Click "Edit" on any item
2. Form will be pre-filled
3. Make changes
4. Click "Update Item"
5. Click "Cancel" to discard changes

#### Deleting Items
1. Click "Delete" on any item
2. Confirm the deletion
3. Item is permanently removed

### 3.4 Order History
1. Go to "Order History" from the navigation
2. View all orders with advanced filtering:
   - **Status cards** — Click to filter by status
   - **Search bar** — Search by student name, email, or order ID
   - **Date range** — Filter orders between two dates
   - **Result count** — Shows how many orders match your filters
3. Click "Clear dates" to remove date filters

### 3.5 Reports & Analytics
1. Go to "Reports" from the navigation
2. Select time range: **Today / Week / Month**
3. View:
   - **Summary cards:** Total orders, revenue, completed, pending
   - **Orders by status:** Bar chart showing distribution
   - **Top 5 items:** Most ordered items with quantities
   - **Low stock alert:** Items with stock < 10 (red if 0, orange if < 10)

### 3.6 Announcements
1. Go to "Announcements" from the navigation
2. **Post New Announcement:**
   - Type your message
   - Select type: ℹ️ Info / ⚠️ Warning / ✅ Success
   - Click "Post"
3. **Manage Announcements:**
   - Active announcements are shown to all users
   - Click "Deactivate" to hide from users (keeps in history)
   - Click "Activate" to show again
   - Click "Delete" to permanently remove

### 3.7 Notifications
- Click the 🔔 bell icon
- You'll see notifications for system events
- Click "Mark all read" to clear

### 3.8 Profile
Same as students — update name or change password.

---

## 4. Troubleshooting

### 4.1 Cannot Register
**Problem:** "Email already registered"  
**Solution:** Use a different email or login with existing account

**Problem:** "Students must register with college email"  
**Solution:** Make sure your email ends with @vnrvjiet.in

**Problem:** "Staff must register with personal email"  
**Solution:** Don't use @vnrvjiet.in email for staff accounts

### 4.2 Cannot Login
**Problem:** "Invalid credentials"  
**Solution:** Check your email and password are correct

**Problem:** Page doesn't load  
**Solution:** Make sure both frontend and backend servers are running

### 4.3 Cannot Place Order
**Problem:** "Insufficient stock"  
**Solution:** Reduce quantity or wait for staff to restock

**Problem:** "Please add items or upload files"  
**Solution:** Make sure you've selected at least one item or uploaded a file

**Problem:** File upload fails  
**Solution:** Check file size is under 10MB and format is supported

### 4.4 Order Not Showing
**Problem:** Order disappeared  
**Solution:** Check if you're filtering by status — click "All Orders"

### 4.5 Notifications Not Updating
**Problem:** Not seeing new notifications  
**Solution:** Notifications poll every 30 seconds — wait or refresh the page

### 4.6 General Issues
**Problem:** Page is blank or shows errors  
**Solution:**
1. Check browser console for errors (F12)
2. Refresh the page (Ctrl+R or Cmd+R)
3. Clear browser cache
4. Make sure MongoDB is running
5. Make sure both servers are running

---

## 5. Tips & Best Practices

**For Students:**
- Place orders in advance to avoid waiting
- Use the reorder feature for frequently ordered items
- Check announcements for shop closure notices
- Rate your orders to help improve service

**For Staff:**
- Update order status promptly so students know when to pick up
- Set estimated pickup times to manage student expectations
- Use announcements for important notices
- Check the Reports page daily to monitor low stock items
- Add staff notes to communicate special instructions

---

## 6. Contact & Support
For technical issues or questions, contact the IT department or the stationery shop staff directly.

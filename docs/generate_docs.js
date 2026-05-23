const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, PageBreak, UnderlineType
} = require('docx');
const fs = require('fs');

// ── helpers ──────────────────────────────────────────────────────────────────
const h1 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 }
});
const h2 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_2,
  spacing: { before: 300, after: 150 }
});
const h3 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_3,
  spacing: { before: 200, after: 100 }
});
const p = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, size: 24, ...opts })],
  spacing: { after: 120 }
});
const bold = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 24 })],
  spacing: { after: 120 }
});
const bullet = (text) => new Paragraph({
  children: [new TextRun({ text, size: 24 })],
  bullet: { level: 0 },
  spacing: { after: 80 }
});
const code = (text) => new Paragraph({
  children: [new TextRun({ text, font: 'Courier New', size: 20, color: '333333' })],
  spacing: { after: 80 },
  indent: { left: 720 }
});
const br = () => new Paragraph({ text: '', spacing: { after: 100 } });
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const tableRow = (cells, isHeader = false) => new TableRow({
  children: cells.map(c => new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text: String(c), bold: isHeader, size: 22 })]
    })],
    width: { size: Math.floor(9000 / cells.length), type: WidthType.DXA }
  }))
});

const makeTable = (headers, rows) => new Table({
  width: { size: 9000, type: WidthType.DXA },
  rows: [tableRow(headers, true), ...rows.map(r => tableRow(r))]
});

const titlePage = (title, subtitle = '') => [
  br(), br(), br(),
  new Paragraph({
    children: [new TextRun({ text: title, bold: true, size: 56, color: '1a73e8' })],
    alignment: AlignmentType.CENTER, spacing: { after: 300 }
  }),
  new Paragraph({
    children: [new TextRun({ text: subtitle, size: 28, color: '555555' })],
    alignment: AlignmentType.CENTER, spacing: { after: 200 }
  }),
  new Paragraph({
    children: [new TextRun({ text: 'VNR Vignana Jyothi Institute of Engineering and Technology', size: 24 })],
    alignment: AlignmentType.CENTER, spacing: { after: 100 }
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Department of Computer Science and Engineering', size: 24 })],
    alignment: AlignmentType.CENTER, spacing: { after: 100 }
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Academic Year: 2025–2026  |  April 2026', size: 24 })],
    alignment: AlignmentType.CENTER, spacing: { after: 100 }
  }),
  pageBreak()
];

// ── SRS Document ─────────────────────────────────────────────────────────────
async function buildSRS() {
  const children = [
    ...titlePage('Software Requirements Specification', 'Campus Stationery Online Ordering System'),
    h1('1. Introduction'),
    h2('1.1 Purpose'),
    p('This document specifies the software requirements for the Campus Stationery Online Ordering System. It describes the functional and non-functional requirements for the web application that allows students to place stationery and print orders online and enables staff to manage and fulfill those orders.'),
    h2('1.2 Scope'),
    p('The system is a web-based application accessible via any modern browser. It serves two types of users — students and stationery shop staff. Students can place orders for stationery items and printing services in advance. Staff can manage inventory, process orders, and communicate with students through the platform.'),
    h2('1.3 Definitions and Acronyms'),
    makeTable(['Term','Definition'],[
      ['SRS','Software Requirements Specification'],
      ['JWT','JSON Web Token — used for authentication'],
      ['API','Application Programming Interface'],
      ['MERN','MongoDB, Express, React, Node.js stack'],
      ['Stock','Quantity of a stationery item available in the shop'],
      ['Order','A request placed by a student for items or printing'],
    ]),
    br(),
    h1('2. Overall Description'),
    h2('2.1 Product Perspective'),
    p('The system replaces the manual, queue-based process at the college stationery shop. Students currently must physically visit the shop, wait in queues, and wait again for their order to be processed. This system allows students to place orders online in advance so that orders are ready for pickup when they arrive.'),
    h2('2.2 User Classes'),
    bold('Students'),
    bullet('Register using their college email (@vnrvjiet.in)'),
    bullet('Place, track, cancel, and reorder stationery/print orders'),
    bullet('Rate completed orders and receive status notifications'),
    bold('Staff'),
    bullet('Register using a personal email'),
    bullet('Manage inventory, process orders, post announcements'),
    bullet('View reports and order history'),
    h2('2.3 Operating Environment'),
    makeTable(['Component','Specification'],[
      ['Client','Any modern web browser (Chrome, Firefox, Edge, Safari)'],
      ['Server','Node.js v16+ on Windows/Linux'],
      ['Database','MongoDB 6+'],
      ['Network','Local network or internet connection'],
    ]),
    br(),
    h1('3. Functional Requirements'),
    h2('3.1 Authentication Module'),
    makeTable(['ID','Requirement'],[
      ['FR-01','The system shall allow users to register with name, email, password, and role'],
      ['FR-02','Students must register with an @vnrvjiet.in email address'],
      ['FR-03','Staff must register with a non-college personal email'],
      ['FR-04','The system shall authenticate users using email and password'],
      ['FR-05','The system shall issue a JWT token upon successful login'],
      ['FR-06','The system shall restrict access to pages based on user role'],
      ['FR-07','Users shall be able to log out and invalidate their session'],
    ]),
    br(),
    h2('3.2 Order Management Module'),
    makeTable(['ID','Requirement'],[
      ['FR-08','Students shall be able to place stationery orders by selecting items and quantities'],
      ['FR-09','Students shall be able to upload documents for printing'],
      ['FR-10','Print orders shall support: copies, color mode, page size, double-sided'],
      ['FR-11','Students shall be able to place mixed orders (stationery + print)'],
      ['FR-12','Students shall be able to select a preferred pickup time slot'],
      ['FR-13','The system shall deduct stock when an order is placed'],
      ['FR-14','The system shall reject orders if stock is insufficient'],
      ['FR-15','Students shall be able to cancel pending orders'],
      ['FR-16','Stock shall be restored when an order is cancelled'],
      ['FR-17','Students shall be able to reorder from a previous order'],
      ['FR-18','Students shall be able to rate and leave feedback on collected orders'],
    ]),
    br(),
    h2('3.3 Inventory Management Module'),
    makeTable(['ID','Requirement'],[
      ['FR-26','Staff shall be able to add new stationery items with name, price, stock, category'],
      ['FR-27','Staff shall be able to edit existing items'],
      ['FR-28','Staff shall be able to delete items'],
      ['FR-29','The system shall display low stock warnings when stock falls below 10'],
      ['FR-30','The system shall display out-of-stock items as unavailable to students'],
    ]),
    br(),
    h2('3.4 Notification & Announcement Module'),
    makeTable(['ID','Requirement'],[
      ['FR-31','The system shall create a notification when an order is placed'],
      ['FR-32','The system shall create a notification when order status changes'],
      ['FR-33','Users shall be able to view their notifications via a bell icon'],
      ['FR-34','Staff shall be able to post announcements visible to all users'],
      ['FR-35','Staff shall be able to activate, deactivate, or delete announcements'],
    ]),
    br(),
    h1('4. Non-Functional Requirements'),
    makeTable(['Category','Requirement'],[
      ['Performance','Pages shall load within 3 seconds; API responses within 1 second'],
      ['Security','Passwords hashed with bcrypt; JWT required for protected routes'],
      ['Usability','Responsive design; works on desktop and mobile browsers'],
      ['Reliability','Invalid inputs handled gracefully; stock operations are atomic'],
      ['Maintainability','Modular MVC structure; routes separated by feature module'],
    ]),
    br(),
    h1('5. System Constraints'),
    bullet('The system requires an active MongoDB instance'),
    bullet('File uploads are stored locally on the server filesystem'),
    bullet('The system does not currently support online payment'),
    bullet('Email notifications are not implemented (in-app only)'),
  ];

  const doc = new Document({ sections: [{ children }] });
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync('1_SRS.docx', buf);
  console.log('Created 1_SRS.docx');
}

// ── Technical Documentation ───────────────────────────────────────────────────
async function buildTechDoc() {
  const children = [
    ...titlePage('Technical Documentation', 'Campus Stationery Online Ordering System'),
    h1('1. System Architecture'),
    p('The application follows a three-tier client-server architecture using the MERN stack.'),
    bold('Presentation Layer (Frontend)'),
    bullet('Built with React 19 and Vite'),
    bullet('Single Page Application (SPA) with React Router'),
    bullet('Responsive design for desktop and mobile'),
    bold('Application Layer (Backend)'),
    bullet('Node.js with Express.js REST API'),
    bullet('JWT-based authentication and role-based access control'),
    bullet('Multer for file upload handling'),
    bold('Data Layer (Database)'),
    bullet('MongoDB document database'),
    bullet('Five collections: users, items, orders, notifications, announcements'),
    br(),
    h1('2. Technology Stack'),
    makeTable(['Layer','Technology','Version'],[
      ['Frontend Framework','React','19.x'],
      ['Build Tool','Vite','8.x'],
      ['Routing','React Router DOM','7.x'],
      ['HTTP Client','Axios','1.x'],
      ['Toast Notifications','React Hot Toast','2.x'],
      ['Backend Framework','Express.js','4.x'],
      ['Runtime','Node.js','22.x'],
      ['Database','MongoDB','8.x'],
      ['ODM','Mongoose','7.x'],
      ['Authentication','JSON Web Token (JWT)','9.x'],
      ['Password Hashing','bcryptjs','2.x'],
      ['File Uploads','Multer','1.x'],
    ]),
    br(),
    h1('3. Project Structure'),
    bold('Client (Frontend)'),
    code('client/src/api/          - Axios instance with JWT interceptor'),
    code('client/src/components/   - Navbar, AnnouncementBanner, NotificationBell'),
    code('client/src/context/      - AuthContext (global auth state)'),
    code('client/src/pages/student/ - Dashboard, PlaceOrder, MyOrders'),
    code('client/src/pages/staff/  - Dashboard, ManageItems, OrderHistory, Reports, Announcements'),
    code('client/src/pages/        - Login, Register, Profile'),
    bold('Server (Backend)'),
    code('server/models/           - User, Item, Order, Notification, Announcement'),
    code('server/routes/           - auth, items, orders, notifications, announcements, profile, reports'),
    code('server/middleware/        - auth.js (JWT verify + staffOnly guard)'),
    code('server/uploads/          - Uploaded print files (auto-created)'),
    br(),
    h1('4. Database Schema'),
    h2('4.1 User'),
    makeTable(['Field','Type','Notes'],[
      ['name','String','Required'],
      ['email','String','Required, unique'],
      ['password','String','Hashed with bcrypt'],
      ['role','Enum','student | staff'],
    ]),
    br(),
    h2('4.2 Item'),
    makeTable(['Field','Type','Notes'],[
      ['name','String','Required'],
      ['description','String','Optional'],
      ['price','Number','Required'],
      ['stock','Number','Default: 0'],
      ['category','Enum','general | paper | writing | binding | other'],
    ]),
    br(),
    h2('4.3 Order'),
    makeTable(['Field','Type','Notes'],[
      ['student','ObjectId → User','Required'],
      ['type','Enum','stationery | print | mixed'],
      ['items','Array of {item, quantity}','Stationery items'],
      ['printJobs','Array of print settings','Print documents'],
      ['status','Enum','pending | processing | ready | collected | cancelled'],
      ['totalAmount','Number','Calculated total'],
      ['staffNote','String','Staff comment'],
      ['estimatedPickup','Date','Set by staff'],
      ['preferredPickup','String','Set by student'],
      ['rating','Number (1-5)','Student rating'],
      ['feedback','String','Student comment'],
    ]),
    br(),
    h1('5. API Reference'),
    h2('Authentication — /api/auth'),
    makeTable(['Method','Endpoint','Auth','Description'],[
      ['POST','/register','No','Register new user'],
      ['POST','/login','No','Login and get JWT token'],
    ]),
    br(),
    h2('Items — /api/items'),
    makeTable(['Method','Endpoint','Auth','Description'],[
      ['GET','/','No','Get all items'],
      ['POST','/','Staff','Add new item'],
      ['PUT','/:id','Staff','Update item'],
      ['DELETE','/:id','Staff','Delete item'],
    ]),
    br(),
    h2('Orders — /api/orders'),
    makeTable(['Method','Endpoint','Auth','Description'],[
      ['POST','/','Student','Place new order'],
      ['GET','/my','Student','Get own orders'],
      ['GET','/all','Staff','Get all orders'],
      ['PUT','/:id/status','Staff','Update order status'],
      ['PUT','/:id/cancel','Student','Cancel pending order'],
      ['PUT','/:id/rate','Student','Rate collected order'],
      ['GET','/:id/reorder','Student','Get order for reorder'],
    ]),
    br(),
    h2('Other Routes'),
    makeTable(['Route','Method','Auth','Description'],[
      ['/api/notifications','GET','Any','Get my notifications'],
      ['/api/notifications/read-all','PUT','Any','Mark all as read'],
      ['/api/announcements','GET','No','Get active announcements'],
      ['/api/announcements','POST','Staff','Create announcement'],
      ['/api/profile','GET/PUT','Any','Get or update profile'],
      ['/api/profile/password','PUT','Any','Change password'],
      ['/api/reports/summary','GET','Staff','Get analytics report'],
    ]),
    br(),
    h1('6. Authentication Flow'),
    p('1. User submits login form with email and password'),
    p('2. POST /api/auth/login — server verifies password with bcrypt'),
    p('3. Server signs JWT: { id, role } with 7-day expiry'),
    p('4. Client stores token in localStorage'),
    p('5. All subsequent requests include: Authorization: Bearer <token>'),
    p('6. authMiddleware verifies token on protected routes'),
    p('7. staffOnly middleware checks role === "staff"'),
    br(),
    h1('7. Stock Management Flow'),
    bold('When order is placed:'),
    bullet('For each item: check item.stock >= requested quantity'),
    bullet('If insufficient → reject entire order with error message'),
    bullet('If sufficient → item.stock -= quantity → save'),
    bold('When order is cancelled:'),
    bullet('For each item: item.stock += quantity (restored via $inc)'),
    br(),
    h1('8. Environment Variables'),
    p('File: server/.env'),
    code('PORT=5000'),
    code('MONGO_URI=mongodb://localhost:27017/stationery_app'),
    code('JWT_SECRET=your_jwt_secret_key_change_this'),
    br(),
    h1('9. Setup & Installation'),
    bold('Backend:'),
    code('cd stationery-app/server'),
    code('npm install'),
    code('node seed.js   (run once to seed 12 sample items)'),
    code('npm run dev    (starts on http://localhost:5000)'),
    bold('Frontend:'),
    code('cd stationery-app/client'),
    code('npm install'),
    code('npm run dev    (starts on http://localhost:5173)'),
  ];

  const doc = new Document({ sections: [{ children }] });
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync('2_Technical_Documentation.docx', buf);
  console.log('Created 2_Technical_Documentation.docx');
}

// ── User Manual ───────────────────────────────────────────────────────────────
async function buildUserManual() {
  const children = [
    ...titlePage('User Manual', 'Campus Stationery Online Ordering System'),
    h1('1. Getting Started'),
    h2('1.1 Accessing the Application'),
    p('Open your web browser and navigate to: http://localhost:5173'),
    h2('1.2 Student Registration'),
    bullet('Click "Register" on the login page'),
    bullet('Enter your Full Name'),
    bullet('Enter your College Email (must end with @vnrvjiet.in)'),
    bullet('Enter a Password (minimum 6 characters)'),
    bullet('Select role: Student'),
    bullet('Click "Register" — you will be automatically logged in'),
    h2('1.3 Staff Registration'),
    bullet('Click "Register" on the login page'),
    bullet('Enter your Full Name'),
    bullet('Enter your Personal Email (must NOT be @vnrvjiet.in)'),
    bullet('Enter a Password'),
    bullet('Select role: Staff'),
    bullet('Click "Register"'),
    h2('1.4 Login'),
    bullet('Enter your registered email and password'),
    bullet('Click "Sign In"'),
    bullet('You will be redirected to your dashboard'),
    br(),
    h1('2. Student Guide'),
    h2('2.1 Dashboard'),
    p('After logging in, you will see three quick access cards:'),
    bullet('Place New Order — Start a new stationery or print order'),
    bullet('My Orders — View and track all your orders'),
    bullet('My Profile — Update your name or change password'),
    h2('2.2 Placing an Order'),
    h3('Step 1: Choose Order Type'),
    bullet('Stationery — Order stationery items only'),
    bullet('Print — Upload documents for printing only'),
    bullet('Both — Order stationery and print together'),
    h3('Step 2A: Ordering Stationery Items'),
    bullet('Use the search bar to find items by name'),
    bullet('Use the category dropdown to filter (general, paper, writing, binding, other)'),
    bullet('Click + to add items, − to reduce quantity'),
    bullet('Out-of-stock items are shown in red and cannot be added'),
    bullet('Your total amount is displayed at the bottom'),
    h3('Step 2B: Uploading Print Documents'),
    bullet('Click "Choose Files" to select documents'),
    bullet('Supported formats: PDF, DOC, DOCX, PNG, JPG (max 10MB each)'),
    bullet('Configure: Copies, Color (B&W or Color), Size (A4/A3/Letter), Double-sided'),
    h3('Step 3: Select Pickup Time (Optional)'),
    bullet('Morning (9am–11am)'),
    bullet('Afternoon (12pm–2pm)'),
    bullet('Evening (3pm–5pm)'),
    h3('Step 4: Submit'),
    p('Click "Place Order". You will receive a confirmation and be redirected to My Orders.'),
    h2('2.3 Order Status Meanings'),
    makeTable(['Status','Meaning'],[
      ['Pending','Order received, waiting to be processed'],
      ['Processing','Staff is preparing your order'],
      ['Ready','Your order is ready for pickup'],
      ['Collected','You have picked up your order'],
      ['Cancelled','Order was cancelled'],
    ]),
    br(),
    h2('2.4 Cancelling an Order'),
    bullet('Go to My Orders'),
    bullet('Only Pending orders can be cancelled'),
    bullet('Click the "Cancel" button — stock will be automatically restored'),
    h2('2.5 Reordering'),
    bullet('Find a completed or cancelled order in My Orders'),
    bullet('Click the "Reorder" button'),
    bullet('You will be taken to the order page with items pre-filled'),
    bullet('Adjust quantities if needed and submit'),
    h2('2.6 Rating an Order'),
    bullet('After an order is marked as Collected, click "Rate"'),
    bullet('Select 1–5 stars'),
    bullet('Optionally leave a comment'),
    bullet('Click "Submit"'),
    h2('2.7 Notifications'),
    bullet('Click the bell icon in the top navigation'),
    bullet('You will see notifications for order placed and status changes'),
    bullet('Unread notifications show a red badge with count'),
    bullet('Click "Mark all read" to clear the badge'),
    h2('2.8 Profile Management'),
    bullet('Click your name in the top navigation or go to My Profile'),
    bullet('Update Name: Enter new name and click Save'),
    bullet('Change Password: Enter current password, new password, confirm, click Update Password'),
    br(),
    h1('3. Staff Guide'),
    h2('3.1 Dashboard'),
    p('The staff dashboard shows order count cards by status and a list of all orders.'),
    h2('3.2 Updating Order Status'),
    bullet('Find the order on the dashboard'),
    bullet('Use the status dropdown at the bottom of the order card'),
    bullet('Select new status — student is automatically notified'),
    h2('3.3 Adding Staff Notes'),
    bullet('Type your note in the "Add staff note..." field'),
    bullet('Change the status to save the note'),
    bullet('Students will see your note on their order'),
    h2('3.4 Setting Estimated Pickup Time'),
    bullet('Click the "Est. Pickup Time" field'),
    bullet('Select date and time when order will be ready'),
    bullet('Change status to save — students will see "Ready by: [time]"'),
    h2('3.5 Managing Inventory'),
    bullet('Go to "Manage Items" from the navigation'),
    bullet('Add Item: Fill in name, price, stock, category and click Add Item'),
    bullet('Edit Item: Click Edit, modify fields, click Update Item'),
    bullet('Delete Item: Click Delete and confirm'),
    bullet('Stock shown in red when 0, orange when below 5'),
    h2('3.6 Order History'),
    bullet('Go to "Order History" from the navigation'),
    bullet('Search by student name, email, or order ID'),
    bullet('Filter by status using the dropdown'),
    bullet('Filter by date range using From/To date pickers'),
    h2('3.7 Reports'),
    bullet('Go to "Reports" from the navigation'),
    bullet('Select time range: Today / Week / Month'),
    bullet('View: Total orders, revenue, orders by status, top 5 items, low stock alerts'),
    h2('3.8 Announcements'),
    bullet('Go to "Announcements" from the navigation'),
    bullet('Post: Type message, select type (Info/Warning/Success), click Post'),
    bullet('Deactivate: Click Deactivate to hide from users'),
    bullet('Delete: Click Delete to permanently remove'),
    br(),
    h1('4. Troubleshooting'),
    makeTable(['Problem','Solution'],[
      ['"Email already registered"','Use a different email or login with existing account'],
      ['"Students must register with college email"','Make sure email ends with @vnrvjiet.in'],
      ['"Invalid credentials"','Check your email and password are correct'],
      ['"Insufficient stock"','Reduce quantity or wait for staff to restock'],
      ['Page is blank or shows errors','Check both servers are running and MongoDB is active'],
      ['Notifications not updating','Notifications poll every 30 seconds — wait or refresh'],
    ]),
  ];

  const doc = new Document({ sections: [{ children }] });
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync('3_User_Manual.docx', buf);
  console.log('Created 3_User_Manual.docx');
}

// ── Project Report ────────────────────────────────────────────────────────────
async function buildProjectReport() {
  const children = [
    ...titlePage('Project Report', 'Campus Stationery Online Ordering System'),
    h1('Abstract'),
    p('The Campus Stationery Online Ordering System is a web-based application developed to address the problem of long waiting queues at the college stationery shop. Students frequently face delays when visiting the shop to print documents or purchase stationery items, especially during peak academic periods. This system allows students to place orders online in advance using their college email, enabling the stationery staff to prepare orders before the student arrives. The application is built using the MERN stack (MongoDB, Express.js, React, Node.js) and provides separate interfaces for students and staff with role-based access control, real-time order tracking, inventory management, notifications, and analytics.'),
    br(),
    h1('1. Introduction'),
    h2('1.1 Background'),
    p('College stationery shops serve hundreds of students daily. Students need to print assignments, projects, and other documents, and also purchase stationery items such as pens, notebooks, and binding materials. The current manual process requires students to physically visit the shop, stand in queues, submit their requests, and wait for the order to be processed. This leads to significant time wastage, especially during examination periods when demand is highest.'),
    h2('1.2 Problem Statement'),
    p('The existing manual system at the VNR VJIET stationery shop suffers from the following issues:'),
    bullet('Long waiting queues during peak hours'),
    bullet('Overcrowding at the shop counter'),
    bullet('Inefficient order processing without advance preparation'),
    bullet('No way for students to track order status'),
    bullet('No inventory visibility for students'),
    bullet('Poor time management for both students and staff'),
    h2('1.3 Objectives'),
    bullet('Develop an online platform for students to place stationery and print orders in advance'),
    bullet('Enable stationery staff to receive, process, and manage orders efficiently'),
    bullet('Reduce waiting time and overcrowding at the stationery shop'),
    bullet('Provide real-time order status tracking for students'),
    bullet('Automate inventory management with stock tracking'),
    bullet('Improve communication between students and staff'),
    br(),
    h1('2. System Design'),
    h2('2.1 Architecture'),
    p('The system uses a three-tier client-server architecture with React frontend, Node.js/Express backend, and MongoDB database.'),
    h2('2.2 Module Design'),
    makeTable(['Module','Description'],[
      ['Authentication','Registration, login, JWT issuance, role validation'],
      ['Order Management','Place, track, cancel, rate, reorder'],
      ['Inventory','CRUD operations on items, stock management'],
      ['Notifications','Auto-create on order events, mark as read'],
      ['Announcements','Post, activate/deactivate, display to users'],
      ['Reports','Aggregate order and revenue data'],
      ['Profile','Update name, change password'],
    ]),
    br(),
    h1('3. Features Implemented'),
    h2('3.1 Student Features'),
    makeTable(['Feature','Description'],[
      ['Registration','College email validation (@vnrvjiet.in)'],
      ['Stationery ordering','Browse, search, filter by category, add to cart'],
      ['Print ordering','Upload documents with print settings'],
      ['Mixed ordering','Combine stationery and print in one order'],
      ['Preferred pickup','Select morning/afternoon/evening slot'],
      ['Order tracking','View status with filter and search'],
      ['Order cancellation','Cancel pending orders with stock restore'],
      ['Reorder','One-click reorder from previous orders'],
      ['Rating','1-5 star rating with feedback on collected orders'],
      ['Notifications','Real-time status update notifications'],
      ['Profile','Update name and change password'],
    ]),
    br(),
    h2('3.2 Staff Features'),
    makeTable(['Feature','Description'],[
      ['Order dashboard','View all orders with status counts'],
      ['Status management','Update order status with auto-notifications'],
      ['Staff notes','Add instructions or comments to orders'],
      ['Estimated pickup','Set expected ready time for students'],
      ['File download','Access uploaded print documents'],
      ['Inventory management','Add, edit, delete items with stock'],
      ['Low stock alerts','Visual warnings for low/zero stock'],
      ['Order history','Full history with search and date filter'],
      ['Reports','Revenue, order counts, top items, low stock'],
      ['Announcements','Post, manage notices for students'],
    ]),
    br(),
    h1('4. Testing'),
    makeTable(['Test Case','Expected Output','Result'],[
      ['Student registration with @vnrvjiet.in','Account created','Pass'],
      ['Student registration with @gmail.com','Error: must use college email','Pass'],
      ['Staff registration with @vnrvjiet.in','Error: must use personal email','Pass'],
      ['Login with correct credentials','JWT token returned','Pass'],
      ['Place order with sufficient stock','Order placed, stock deducted','Pass'],
      ['Place order with insufficient stock','Insufficient stock error','Pass'],
      ['Cancel pending order','Cancelled, stock restored','Pass'],
      ['Cancel non-pending order','Error: only pending can cancel','Pass'],
      ['Staff update order status','Status updated, notification sent','Pass'],
      ['Rate collected order','Rating saved','Pass'],
      ['Access staff route as student','Redirect to home','Pass'],
      ['Access protected route without token','401 Unauthorized','Pass'],
    ]),
    br(),
    h1('5. Results and Discussion'),
    p('The system successfully addresses all the stated objectives:'),
    bullet('Reduced waiting time: Students can place orders in advance and collect them without waiting in queues'),
    bullet('Improved efficiency: Staff can prepare orders before students arrive, reducing counter time'),
    bullet('Real-time tracking: Students know exactly when their order is ready through notifications'),
    bullet('Inventory control: Automatic stock management prevents overselling and provides low stock alerts'),
    bullet('Better communication: Announcements and notifications keep students informed'),
    bullet('Data insights: Reports help staff understand demand patterns and manage inventory proactively'),
    br(),
    h1('6. Conclusion'),
    p('The Campus Stationery Online Ordering System successfully digitizes the stationery shop ordering process at VNR VJIET. The application provides a seamless experience for students to place orders online and for staff to manage them efficiently. The system reduces physical queues, improves time management, and enhances communication between students and the stationery shop. The MERN stack proved to be an effective choice for this application, providing a consistent JavaScript environment across frontend and backend, rapid development capability, and flexible data modeling.'),
    br(),
    h1('7. Future Enhancements'),
    makeTable(['Enhancement','Description'],[
      ['Payment integration','Online payment via UPI/Razorpay'],
      ['Email notifications','Send email alerts on status changes'],
      ['Push notifications','Browser push notifications'],
      ['Mobile app','React Native mobile application'],
      ['Print cost calculator','Auto-calculate print cost based on pages and settings'],
      ['QR code pickup','Generate QR code for order pickup verification'],
      ['Bulk stock import','Upload CSV to update multiple item stocks'],
    ]),
    br(),
    h1('8. References'),
    bullet('MongoDB Documentation — https://www.mongodb.com/docs'),
    bullet('Express.js Documentation — https://expressjs.com'),
    bullet('React Documentation — https://react.dev'),
    bullet('Node.js Documentation — https://nodejs.org/docs'),
    bullet('JSON Web Tokens — https://jwt.io'),
    bullet('Multer File Upload — https://github.com/expressjs/multer'),
    bullet('React Router — https://reactrouter.com'),
    bullet('Vite Build Tool — https://vitejs.dev'),
  ];

  const doc = new Document({ sections: [{ children }] });
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync('4_Project_Report.docx', buf);
  console.log('Created 4_Project_Report.docx');
}

// ── Run all ───────────────────────────────────────────────────────────────────
(async () => {
  await buildSRS();
  await buildTechDoc();
  await buildUserManual();
  await buildProjectReport();
  console.log('\nAll Word documents generated in stationery-app/docs/');
})();

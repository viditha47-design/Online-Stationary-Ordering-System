import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import StudentDashboard from './pages/student/Dashboard';
import PlaceOrder from './pages/student/PlaceOrder';
import MyOrders from './pages/student/MyOrders';
import StaffDashboard from './pages/staff/Dashboard';
import ManageItems from './pages/staff/ManageItems';
import OrderHistory from './pages/staff/OrderHistory';
import Reports from './pages/staff/Reports';
import Announcements from './pages/staff/Announcements';
import Navbar from './components/Navbar';
import AnnouncementBanner from './components/AnnouncementBanner';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      {user && <AnnouncementBanner />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          user ? (user.role === 'staff' ? <Navigate to="/staff" /> : <Navigate to="/student" />) : <Navigate to="/login" />
        } />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/order" element={<ProtectedRoute role="student"><PlaceOrder /></ProtectedRoute>} />
        <Route path="/student/orders" element={<ProtectedRoute role="student"><MyOrders /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute role="staff"><StaffDashboard /></ProtectedRoute>} />
        <Route path="/staff/items" element={<ProtectedRoute role="staff"><ManageItems /></ProtectedRoute>} />
        <Route path="/staff/history" element={<ProtectedRoute role="staff"><OrderHistory /></ProtectedRoute>} />
        <Route path="/staff/reports" element={<ProtectedRoute role="staff"><Reports /></ProtectedRoute>} />
        <Route path="/staff/announcements" element={<ProtectedRoute role="staff"><Announcements /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

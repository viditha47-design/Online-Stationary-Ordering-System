import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>📚 CampusStationery</Link>
      <div style={styles.links}>
        {user?.role === 'student' && (
          <>
            <Link to="/student" style={styles.link}>Home</Link>
            <Link to="/student/order" style={styles.link}>New Order</Link>
            <Link to="/student/orders" style={styles.link}>My Orders</Link>
          </>
        )}
        {user?.role === 'staff' && (
          <>
            <Link to="/staff" style={styles.link}>Dashboard</Link>
            <Link to="/staff/history" style={styles.link}>Order History</Link>
            <Link to="/staff/items" style={styles.link}>Manage Items</Link>
            <Link to="/staff/reports" style={styles.link}>Reports</Link>
            <Link to="/staff/announcements" style={styles.link}>Announcements</Link>
          </>
        )}
        {user && (
          <>
            <NotificationBell />
            <Link to="/profile" style={styles.link}>👤 {user.name}</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
        {!user && <Link to="/login" style={styles.link}>Login</Link>}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#1a73e8', color: '#fff', flexWrap: 'wrap', gap: '8px' },
  brand: { color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' },
  links: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '0.95rem' },
  logoutBtn: { background: 'rgba(255,255,255,0.2)', border: '1px solid #fff', color: '#fff', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }
};

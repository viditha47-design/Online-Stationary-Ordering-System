import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <h2 style={styles.welcome}>Welcome, {user?.name} 👋</h2>
      <p style={styles.sub}>What would you like to do today?</p>
      <div style={styles.grid}>
        <Link to="/student/order" style={styles.card}>
          <div style={styles.icon}>🖨️</div>
          <h3>Place New Order</h3>
          <p>Upload documents for printing or order stationery items</p>
        </Link>
        <Link to="/student/orders" style={styles.card}>
          <div style={styles.icon}>📋</div>
          <h3>My Orders</h3>
          <p>Track status, reorder, or rate your past orders</p>
        </Link>
        <Link to="/profile" style={styles.card}>
          <div style={styles.icon}>👤</div>
          <h3>My Profile</h3>
          <p>Update your name or change your password</p>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '40px auto', padding: '0 20px' },
  welcome: { fontSize: '1.8rem', color: '#1a73e8' },
  sub: { color: '#666', marginBottom: '32px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' },
  card: { background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textDecoration: 'none', color: '#333', textAlign: 'center', display: 'block' },
  icon: { fontSize: '2.5rem', marginBottom: '12px' }
};

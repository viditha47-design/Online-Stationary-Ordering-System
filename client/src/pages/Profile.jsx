import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, login } = useAuth();
  const [name, setName] = useState('');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { setName(user?.name || ''); }, [user]);

  const updateName = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/profile', { name });
      login({ ...user, name: data.name }, localStorage.getItem('token'));
      toast.success('Name updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.put('/profile/password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password updated');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Profile</h2>

      <div style={styles.card}>
        <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
        <p style={styles.email}>{user?.email}</p>
        <span style={styles.role}>{user?.role}</span>
      </div>

      <div style={styles.section}>
        <h3>Update Name</h3>
        <form onSubmit={updateName} style={styles.form}>
          <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
          <button style={styles.btn} type="submit" disabled={loading}>Save</button>
        </form>
      </div>

      <div style={styles.section}>
        <h3>Change Password</h3>
        <form onSubmit={updatePassword} style={styles.form}>
          <input style={styles.input} type="password" placeholder="Current password"
            value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
          <input style={styles.input} type="password" placeholder="New password"
            value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} required />
          <input style={styles.input} type="password" placeholder="Confirm new password"
            value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} required />
          <button style={styles.btn} type="submit" disabled={loading}>Update Password</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '500px', margin: '32px auto', padding: '0 20px' },
  title: { color: '#1a73e8', marginBottom: '20px' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', marginBottom: '20px' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', background: '#1a73e8', color: '#fff', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  email: { color: '#555', margin: '4px 0' },
  role: { background: '#e8f0fe', color: '#1a73e8', padding: '3px 12px', borderRadius: '12px', fontSize: '0.8rem', textTransform: 'capitalize' },
  section: { background: '#fff', borderRadius: '10px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' },
  input: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' },
  btn: { padding: '10px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

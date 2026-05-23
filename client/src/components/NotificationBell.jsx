import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const fetch = () => api.get('/notifications').then(r => setNotifications(r.data)).catch(() => {});

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    fetch();
  };

  return (
    <div ref={ref} style={styles.wrap}>
      <button style={styles.bell} onClick={() => setOpen(o => !o)}>
        🔔
        {unread > 0 && <span style={styles.badge}>{unread}</span>}
      </button>
      {open && (
        <div style={styles.dropdown}>
          <div style={styles.dropHeader}>
            <strong>Notifications</strong>
            {unread > 0 && <button style={styles.markBtn} onClick={markAllRead}>Mark all read</button>}
          </div>
          {notifications.length === 0 && <p style={styles.empty}>No notifications</p>}
          {notifications.map(n => (
            <div key={n._id} style={{ ...styles.item, background: n.read ? '#fff' : '#e8f0fe' }}>
              <p style={styles.msg}>{n.message}</p>
              <span style={styles.time}>{new Date(n.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { position: 'relative' },
  bell: { background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', position: 'relative', padding: '0 4px' },
  badge: { position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', borderRadius: '50%', fontSize: '0.65rem', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  dropdown: { position: 'absolute', right: 0, top: '36px', width: '320px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 1000, maxHeight: '400px', overflowY: 'auto' },
  dropHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' },
  markBtn: { background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '0.8rem' },
  empty: { padding: '20px', textAlign: 'center', color: '#999' },
  item: { padding: '10px 16px', borderBottom: '1px solid #f5f5f5' },
  msg: { margin: 0, fontSize: '0.88rem', color: '#333' },
  time: { fontSize: '0.75rem', color: '#aaa' }
};

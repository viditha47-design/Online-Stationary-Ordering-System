import { useState, useEffect } from 'react';
import api from '../api/axios';

const TYPE_STYLES = {
  info:    { background: '#e8f0fe', color: '#1a73e8', border: '1px solid #c5d8fd' },
  warning: { background: '#fff8e1', color: '#f59e0b', border: '1px solid #fde68a' },
  success: { background: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0' }
};
const TYPE_ICONS = { info: 'ℹ️', warning: '⚠️', success: '✅' };

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    api.get('/announcements').then(r => setAnnouncements(r.data)).catch(() => {});
  }, []);

  const visible = announcements.filter(a => !dismissed.includes(a._id));
  if (visible.length === 0) return null;

  return (
    <div style={{ padding: '0 0 4px' }}>
      {visible.map(a => (
        <div key={a._id} style={{ ...styles.banner, ...TYPE_STYLES[a.type] }}>
          <span>{TYPE_ICONS[a.type]} {a.message}</span>
          <button style={styles.close} onClick={() => setDismissed(d => [...d, a._id])}>✕</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  banner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 24px', fontSize: '0.9rem' },
  close: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.6 }
};

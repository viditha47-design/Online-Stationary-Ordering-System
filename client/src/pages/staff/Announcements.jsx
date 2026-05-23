import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ message: '', type: 'info' });

  const fetch = () => api.get('/announcements/all').then(r => setAnnouncements(r.data)).catch(() => {});
  useEffect(() => { fetch(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', form);
      toast.success('Announcement posted');
      setForm({ message: '', type: 'info' });
      fetch();
    } catch { toast.error('Failed'); }
  };

  const toggle = async (id, active) => {
    await api.put(`/announcements/${id}`, { active: !active });
    fetch();
  };

  const remove = async (id) => {
    await api.delete(`/announcements/${id}`);
    toast.success('Deleted');
    fetch();
  };

  const TYPE_COLORS = { info: '#1a73e8', warning: '#f59e0b', success: '#10b981' };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Announcements</h2>

      <div style={styles.formCard}>
        <h3>Post New Announcement</h3>
        <form onSubmit={create} style={styles.form}>
          <textarea style={styles.textarea} placeholder="Announcement message..." value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })} rows={3} required />
          <div style={styles.row}>
            <select style={styles.select} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="info">ℹ️ Info</option>
              <option value="warning">⚠️ Warning</option>
              <option value="success">✅ Success</option>
            </select>
            <button style={styles.btn} type="submit">Post</button>
          </div>
        </form>
      </div>

      {announcements.map(a => (
        <div key={a._id} style={{ ...styles.card, borderLeft: `4px solid ${TYPE_COLORS[a.type]}`, opacity: a.active ? 1 : 0.5 }}>
          <p style={styles.msg}>{a.message}</p>
          <div style={styles.cardFooter}>
            <span style={{ color: TYPE_COLORS[a.type], fontSize: '0.8rem' }}>{a.type} • {new Date(a.createdAt).toLocaleString()}</span>
            <div style={styles.actions}>
              <button style={styles.toggleBtn} onClick={() => toggle(a._id, a.active)}>
                {a.active ? 'Deactivate' : 'Activate'}
              </button>
              <button style={styles.deleteBtn} onClick={() => remove(a._id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '32px auto', padding: '0 20px' },
  title: { color: '#1a73e8', marginBottom: '20px' },
  formCard: { background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', marginBottom: '24px' },
  form: { marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' },
  textarea: { padding: '10px', border: '1px solid #ddd', borderRadius: '6px', resize: 'vertical', fontSize: '0.95rem' },
  row: { display: 'flex', gap: '10px' },
  select: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', flex: 1 },
  btn: { padding: '8px 24px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  card: { background: '#fff', padding: '16px', borderRadius: '8px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  msg: { margin: '0 0 10px', color: '#333' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' },
  actions: { display: 'flex', gap: '8px' },
  toggleBtn: { padding: '4px 12px', background: '#e8f0fe', color: '#1a73e8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
  deleteBtn: { padding: '4px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }
};

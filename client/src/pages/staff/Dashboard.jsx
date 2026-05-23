import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'processing', 'ready', 'collected', 'cancelled'];
const STATUS_COLORS = {
  pending: '#f59e0b', processing: '#3b82f6', ready: '#10b981', collected: '#6b7280', cancelled: '#ef4444'
};

export default function StaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [staffNote, setStaffNote] = useState({});

  const fetchOrders = async () => {
    try {
      const url = filter ? `/orders/all?status=${filter}` : '/orders/all';
      const { data } = await api.get(url);
      setOrders(data);
      // Pre-populate staffNote state with existing saved values
      const prefill = {};
      data.forEach(o => {
        if (o.staffNote) prefill[o._id] = o.staffNote;
        if (o.estimatedPickup) {
          // Convert to datetime-local format: YYYY-MM-DDTHH:mm
          const d = new Date(o.estimatedPickup);
          const pad = n => String(n).padStart(2, '0');
          prefill[`${o._id}_eta`] = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        }
      });
      setStaffNote(prefill);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, {
        status,
        staffNote: staffNote[id] || '',
        estimatedPickup: staffNote[`${id}_eta`] || undefined
      });
      toast.success('Status updated');
      fetchOrders();
    } catch {
      toast.error('Update failed');
    }
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Staff Dashboard</h2>

      <div style={styles.statsRow}>
        {STATUSES.map(s => (
          <div key={s} style={{ ...styles.statCard, borderTop: `4px solid ${STATUS_COLORS[s]}` }}>
            <div style={styles.statNum}>{counts[s]}</div>
            <div style={styles.statLabel}>{s}</div>
          </div>
        ))}
      </div>

      <div style={styles.filterRow}>
        <label>Filter by status: </label>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={styles.select}>
          <option value="">All</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={fetchOrders} style={styles.refreshBtn}>↻ Refresh</button>
      </div>

      {orders.length === 0 && <p style={{ color: '#999' }}>No orders found.</p>}

      {orders.map(order => (
        <div key={order._id} style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <span style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</span>
              <span style={styles.studentName}>{order.student?.name} ({order.student?.email})</span>
              <span style={styles.type}>{order.type}</span>
            </div>
            <span style={{ ...styles.status, background: STATUS_COLORS[order.status] }}>
              {order.status.toUpperCase()}
            </span>
          </div>

          {order.items?.length > 0 && (
            <div style={styles.section}>
              <strong>Items:</strong>
              <ul style={styles.list}>
                {order.items.map((oi, i) => (
                  <li key={i}>{oi.item?.name || 'Item'} × {oi.quantity} — ₹{(oi.item?.price || 0) * oi.quantity}</li>
                ))}
              </ul>
            </div>
          )}

          {order.printJobs?.length > 0 && (
            <div style={styles.section}>
              <strong>Print Jobs:</strong>
              <ul style={styles.list}>
                {order.printJobs.map((pj, i) => (
                  <li key={i}>
                    {pj.originalName} — {pj.copies} copy, {pj.colorMode}, {pj.pageSize}{pj.doubleSided ? ', double-sided' : ''}
                    {pj.filename && (
                      <a href={`http://localhost:5000/uploads/${pj.filename}`} target="_blank" rel="noreferrer" style={styles.downloadLink}> [Download]</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {order.notes && <p style={styles.notes}>Student note: {order.notes}</p>}
          {order.preferredPickup && <p style={styles.notes}>🕐 Preferred pickup: {order.preferredPickup}</p>}
          {order.totalAmount > 0 && <p style={styles.amount}>Total: ₹{order.totalAmount}</p>}

          <div style={styles.actionRow}>
            <input
              style={styles.noteInput}
              placeholder="Add staff note..."
              value={staffNote[order._id] || ''}
              onChange={e => setStaffNote(prev => ({ ...prev, [order._id]: e.target.value }))}
            />
            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.75rem', color: '#888', gap: '3px' }}>
              Est. Pickup Time
              <input type="datetime-local" style={styles.noteInput}
                value={staffNote[`${order._id}_eta`] || ''}
                onChange={e => setStaffNote(prev => ({ ...prev, [`${order._id}_eta`]: e.target.value }))}
              />
            </label>
            <select
              style={styles.statusSelect}
              defaultValue={order.status}
              onChange={e => updateStatus(order._id, e.target.value)}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <p style={styles.date}>Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '32px auto', padding: '0 20px' },
  title: { color: '#1a73e8', marginBottom: '20px' },
  center: { textAlign: 'center', marginTop: '60px', color: '#999' },
  statsRow: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  statCard: { background: '#fff', padding: '16px 20px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', minWidth: '100px', textAlign: 'center' },
  statNum: { fontSize: '1.8rem', fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: '0.8rem', color: '#888', textTransform: 'capitalize' },
  filterRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  select: { padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px' },
  refreshBtn: { padding: '6px 14px', background: '#e8f0fe', color: '#1a73e8', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  card: { background: '#fff', borderRadius: '10px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  orderId: { fontWeight: 'bold', fontSize: '1rem', marginRight: '8px' },
  studentName: { color: '#555', fontSize: '0.9rem', marginRight: '8px' },
  type: { background: '#e8f0fe', color: '#1a73e8', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' },
  status: { color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap' },
  section: { marginBottom: '8px' },
  list: { paddingLeft: '20px', margin: '4px 0', color: '#555', fontSize: '0.9rem' },
  downloadLink: { color: '#1a73e8', marginLeft: '6px' },
  notes: { color: '#666', fontSize: '0.9rem', fontStyle: 'italic' },
  amount: { fontWeight: 'bold', color: '#1a73e8' },
  actionRow: { display: 'flex', gap: '10px', marginTop: '14px' },
  noteInput: { flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' },
  statusSelect: { padding: '8px 12px', border: '1px solid #1a73e8', borderRadius: '6px', color: '#1a73e8', fontWeight: 'bold', cursor: 'pointer' },
  date: { color: '#bbb', fontSize: '0.8rem', marginTop: '8px' }
};

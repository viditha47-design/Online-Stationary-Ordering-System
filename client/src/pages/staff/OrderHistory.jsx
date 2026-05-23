import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: '#f59e0b', processing: '#3b82f6', ready: '#10b981', collected: '#6b7280', cancelled: '#ef4444'
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    api.get('/orders/all')
      .then(r => setOrders(r.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter;
    const matchSearch = search === '' ||
      o._id.slice(-6).toLowerCase().includes(search.toLowerCase()) ||
      o.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.student?.email?.toLowerCase().includes(search.toLowerCase());
    const orderDate = new Date(o.createdAt);
    const matchFrom = !dateFrom || orderDate >= new Date(dateFrom);
    const matchTo = !dateTo || orderDate <= new Date(dateTo + 'T23:59:59');
    return matchStatus && matchSearch && matchFrom && matchTo;
  });

  const counts = Object.keys(STATUS_COLORS).reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Order History</h2>

      {/* Stats */}
      <div style={styles.statsRow}>
        {Object.entries(STATUS_COLORS).map(([s, color]) => (
          <div key={s} onClick={() => setFilter(filter === s ? 'all' : s)}
            style={{ ...styles.statCard, borderTop: `4px solid ${color}`, cursor: 'pointer', opacity: filter !== 'all' && filter !== s ? 0.5 : 1 }}>
            <div style={styles.statNum}>{counts[s] || 0}</div>
            <div style={styles.statLabel}>{s}</div>
          </div>
        ))}
        <div style={{ ...styles.statCard, borderTop: '4px solid #1a73e8' }}>
          <div style={styles.statNum}>{orders.length}</div>
          <div style={styles.statLabel}>total</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterRow}>
        <input style={styles.searchInput} placeholder="Search by student name, email or order ID..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select style={styles.select} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={styles.dateRow}>
        <label style={styles.dateLabel}>From:
          <input type="date" style={styles.dateInput} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </label>
        <label style={styles.dateLabel}>To:
          <input type="date" style={styles.dateInput} value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </label>
        {(dateFrom || dateTo) && (
          <button style={styles.clearBtn} onClick={() => { setDateFrom(''); setDateTo(''); }}>Clear dates</button>
        )}
        <span style={styles.resultCount}>{filtered.length} order{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {filtered.length === 0 && <p style={{ color: '#999', marginTop: '20px' }}>No orders match your filters.</p>}

      {filtered.map(order => (
        <div key={order._id} style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <span style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</span>
              <span style={styles.studentName}>{order.student?.name}</span>
              <span style={styles.studentEmail}>{order.student?.email}</span>
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
                  <li key={i}>{pj.originalName} — {pj.copies} copy, {pj.colorMode}, {pj.pageSize}{pj.doubleSided ? ', double-sided' : ''}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={styles.footer}>
            {order.totalAmount > 0 && <span style={styles.amount}>₹{order.totalAmount}</span>}
            {order.staffNote && <span style={styles.staffNote}>Note: {order.staffNote}</span>}
            <span style={styles.date}>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '32px auto', padding: '0 20px' },
  title: { color: '#1a73e8', marginBottom: '20px' },
  center: { textAlign: 'center', marginTop: '60px', color: '#999' },
  statsRow: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  statCard: { background: '#fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', minWidth: '90px', textAlign: 'center' },
  statNum: { fontSize: '1.5rem', fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: '0.75rem', color: '#888', textTransform: 'capitalize' },
  filterRow: { display: 'flex', gap: '10px', marginBottom: '10px' },
  searchInput: { flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' },
  select: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' },
  dateRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' },
  dateLabel: { fontSize: '0.9rem', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' },
  dateInput: { padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px' },
  clearBtn: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  resultCount: { marginLeft: 'auto', color: '#888', fontSize: '0.85rem' },
  card: { background: '#fff', borderRadius: '10px', padding: '20px', marginBottom: '14px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' },
  orderId: { fontWeight: 'bold', fontSize: '1rem', marginRight: '8px' },
  studentName: { color: '#333', fontWeight: '500', marginRight: '6px' },
  studentEmail: { color: '#888', fontSize: '0.85rem', marginRight: '8px' },
  type: { background: '#e8f0fe', color: '#1a73e8', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' },
  status: { color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap' },
  section: { marginBottom: '8px' },
  list: { paddingLeft: '20px', margin: '4px 0', color: '#555', fontSize: '0.9rem' },
  footer: { display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', borderTop: '1px solid #f0f0f0', paddingTop: '10px', flexWrap: 'wrap' },
  amount: { fontWeight: 'bold', color: '#1a73e8' },
  staffNote: { color: '#10b981', fontSize: '0.85rem', fontStyle: 'italic' },
  date: { marginLeft: 'auto', color: '#bbb', fontSize: '0.8rem' }
};

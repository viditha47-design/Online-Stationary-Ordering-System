import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: '#f59e0b', processing: '#3b82f6', ready: '#10b981', collected: '#6b7280', cancelled: '#ef4444'
};

function StarRating({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => onChange(s)}
          style={{ fontSize: '1.4rem', cursor: 'pointer', color: s <= value ? '#f59e0b' : '#ddd' }}>★</span>
      ))}
    </div>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [ratingModal, setRatingModal] = useState(null); // { orderId }
  const [ratingVal, setRatingVal] = useState(5);
  const [feedbackVal, setFeedbackVal] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/my');
      setOrders(data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const cancelOrder = async (id) => {
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); }
  };

  const submitRating = async () => {
    try {
      await api.put(`/orders/${ratingModal}/rate`, { rating: ratingVal, feedback: feedbackVal });
      toast.success('Thank you for your feedback!');
      setRatingModal(null);
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const reorder = async (orderId) => {
    try {
      const { data } = await api.get(`/orders/${orderId}/reorder`);
      // Pass reorder data via sessionStorage
      sessionStorage.setItem('reorderData', JSON.stringify(data));
      navigate('/student/order');
    } catch { toast.error('Failed to load order'); }
  };

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter;
    const matchSearch = search === '' ||
      o._id.slice(-6).toLowerCase().includes(search.toLowerCase()) ||
      o.type.includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = ['pending','processing','ready','collected','cancelled'].reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Order History</h2>

      <div style={styles.statsRow}>
        {Object.entries(STATUS_COLORS).map(([s, color]) => (
          <div key={s} onClick={() => setFilter(filter === s ? 'all' : s)}
            style={{ ...styles.statCard, borderTop: `4px solid ${color}`, cursor: 'pointer', opacity: filter !== 'all' && filter !== s ? 0.5 : 1 }}>
            <div style={styles.statNum}>{counts[s] || 0}</div>
            <div style={styles.statLabel}>{s}</div>
          </div>
        ))}
      </div>

      <div style={styles.filterRow}>
        <input style={styles.searchInput} placeholder="Search by order ID or type..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select style={styles.select} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="ready">Ready for Pickup</option>
          <option value="collected">Collected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filtered.length === 0 && <p style={{ color: '#999' }}>No orders found.</p>}

      {filtered.map(order => (
        <div key={order._id} style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <span style={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</span>
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
                {order.items.map((oi, i) => <li key={i}>{oi.item?.name || 'Item'} × {oi.quantity}</li>)}
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

          {order.totalAmount > 0 && <p style={styles.amount}>Total: ₹{order.totalAmount}</p>}
          {order.preferredPickup && <p style={styles.pickup}>🕐 Preferred pickup: {order.preferredPickup}</p>}
          {order.estimatedPickup && <p style={styles.estPickup}>✅ Ready by: {new Date(order.estimatedPickup).toLocaleString()}</p>}
          {order.notes && <p style={styles.notes}>Note: {order.notes}</p>}
          {order.staffNote && <p style={styles.staffNote}>✓ Staff: {order.staffNote}</p>}
          {order.rating && (
            <div style={styles.ratingDisplay}>
              {'★'.repeat(order.rating)}{'☆'.repeat(5 - order.rating)} &nbsp;
              {order.feedback && <span style={{ color: '#666', fontSize: '0.85rem' }}>{order.feedback}</span>}
            </div>
          )}

          <div style={styles.footer}>
            <span style={styles.date}>{new Date(order.createdAt).toLocaleString()}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {order.status === 'pending' && (
                <button style={styles.cancelBtn} onClick={() => cancelOrder(order._id)}>Cancel</button>
              )}
              {order.status === 'collected' && !order.rating && (
                <button style={styles.rateBtn} onClick={() => { setRatingModal(order._id); setRatingVal(5); setFeedbackVal(''); }}>
                  ⭐ Rate
                </button>
              )}
              {(order.status === 'collected' || order.status === 'cancelled') && (
                <button style={styles.reorderBtn} onClick={() => reorder(order._id)}>🔄 Reorder</button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Rating Modal */}
      {ratingModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Rate your experience</h3>
            <StarRating value={ratingVal} onChange={setRatingVal} />
            <textarea style={styles.feedbackInput} placeholder="Leave a comment (optional)"
              value={feedbackVal} onChange={e => setFeedbackVal(e.target.value)} rows={3} />
            <div style={styles.modalBtns}>
              <button style={styles.submitBtn} onClick={submitRating}>Submit</button>
              <button style={styles.cancelModalBtn} onClick={() => setRatingModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '32px auto', padding: '0 20px' },
  title: { color: '#1a73e8', marginBottom: '20px' },
  center: { textAlign: 'center', marginTop: '60px', color: '#999' },
  statsRow: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  statCard: { background: '#fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', minWidth: '90px', textAlign: 'center' },
  statNum: { fontSize: '1.5rem', fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: '0.75rem', color: '#888', textTransform: 'capitalize' },
  filterRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  searchInput: { flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' },
  select: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' },
  card: { background: '#fff', borderRadius: '10px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  orderId: { fontWeight: 'bold', fontSize: '1rem', marginRight: '10px' },
  type: { background: '#e8f0fe', color: '#1a73e8', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' },
  status: { color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' },
  section: { marginBottom: '8px' },
  list: { paddingLeft: '20px', margin: '4px 0', color: '#555' },
  amount: { fontWeight: 'bold', color: '#1a73e8', margin: '8px 0 0' },
  pickup: { color: '#666', fontSize: '0.88rem', marginTop: '4px' },
  estPickup: { color: '#10b981', fontSize: '0.88rem', marginTop: '4px', fontWeight: '500' },
  notes: { color: '#666', fontSize: '0.9rem', marginTop: '6px' },
  staffNote: { color: '#10b981', fontSize: '0.9rem', marginTop: '4px', fontStyle: 'italic' },
  ratingDisplay: { color: '#f59e0b', marginTop: '6px', fontSize: '1rem' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #f0f0f0', paddingTop: '10px' },
  date: { color: '#999', fontSize: '0.85rem' },
  cancelBtn: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  rateBtn: { background: '#fff8e1', color: '#f59e0b', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  reorderBtn: { background: '#e8f0fe', color: '#1a73e8', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  modal: { background: '#fff', borderRadius: '12px', padding: '28px', width: '360px', display: 'flex', flexDirection: 'column', gap: '14px' },
  feedbackInput: { padding: '10px', border: '1px solid #ddd', borderRadius: '6px', resize: 'vertical', fontSize: '0.9rem' },
  modalBtns: { display: 'flex', gap: '10px' },
  submitBtn: { flex: 1, padding: '10px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  cancelModalBtn: { flex: 1, padding: '10px', background: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }
};

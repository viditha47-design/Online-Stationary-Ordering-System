import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: '#f59e0b', processing: '#3b82f6', ready: '#10b981', collected: '#6b7280', cancelled: '#ef4444'
};

export default function Reports() {
  const [range, setRange] = useState('week');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data: d } = await api.get(`/reports/summary?range=${range}`);
      setData(d);
    } catch { toast.error('Failed to load report'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReport(); }, [range]);

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Reports & Analytics</h2>
        <div style={styles.rangeRow}>
          {['today', 'week', 'month'].map(r => (
            <button key={r} style={{ ...styles.rangeBtn, ...(range === r ? styles.activeRange : {}) }}
              onClick={() => setRange(r)}>{r.charAt(0).toUpperCase() + r.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryNum}>{data?.totalOrders || 0}</div>
          <div style={styles.summaryLabel}>Total Orders</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryNum}>₹{data?.totalRevenue?.toFixed(2) || '0.00'}</div>
          <div style={styles.summaryLabel}>Total Revenue</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryNum}>{data?.byStatus?.collected || 0}</div>
          <div style={styles.summaryLabel}>Completed</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryNum}>{data?.byStatus?.pending || 0}</div>
          <div style={styles.summaryLabel}>Pending</div>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Orders by status */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Orders by Status</h3>
          {Object.entries(data?.byStatus || {}).map(([status, count]) => (
            <div key={status} style={styles.barRow}>
              <span style={styles.barLabel}>{status}</span>
              <div style={styles.barTrack}>
                <div style={{ ...styles.barFill, width: `${Math.min(100, (count / (data?.totalOrders || 1)) * 100)}%`, background: STATUS_COLORS[status] || '#ccc' }} />
              </div>
              <span style={styles.barCount}>{count}</span>
            </div>
          ))}
        </div>

        {/* Top items */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Top Ordered Items</h3>
          {data?.topItems?.length === 0 && <p style={{ color: '#999' }}>No data</p>}
          {data?.topItems?.map((item, i) => (
            <div key={i} style={styles.topItem}>
              <span style={styles.rank}>#{i + 1}</span>
              <span style={styles.itemName}>{item.name}</span>
              <span style={styles.itemQty}>{item.qty} units</span>
            </div>
          ))}
        </div>
      </div>

      {/* Low stock alert */}
      {data?.lowStock?.length > 0 && (
        <div style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, color: '#ef4444' }}>⚠️ Low Stock Alert</h3>
          <div style={styles.lowStockGrid}>
            {data.lowStock.map(item => (
              <div key={item._id} style={{ ...styles.lowStockCard, borderLeft: `4px solid ${item.stock === 0 ? '#ef4444' : '#f59e0b'}` }}>
                <strong>{item.name}</strong>
                <span style={{ color: item.stock === 0 ? '#ef4444' : '#f59e0b', fontWeight: 'bold' }}>
                  {item.stock === 0 ? 'Out of stock' : `${item.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '32px auto', padding: '0 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title: { color: '#1a73e8', margin: 0 },
  rangeRow: { display: 'flex', gap: '8px' },
  rangeBtn: { padding: '6px 16px', border: '1px solid #ddd', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '0.9rem' },
  activeRange: { background: '#1a73e8', color: '#fff', border: '1px solid #1a73e8' },
  center: { textAlign: 'center', marginTop: '60px', color: '#999' },
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' },
  summaryCard: { background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', textAlign: 'center' },
  summaryNum: { fontSize: '1.8rem', fontWeight: 'bold', color: '#1a73e8' },
  summaryLabel: { color: '#888', fontSize: '0.85rem', marginTop: '4px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  section: { background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', marginBottom: '20px' },
  sectionTitle: { margin: '0 0 16px', color: '#333' },
  barRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
  barLabel: { width: '90px', fontSize: '0.85rem', textTransform: 'capitalize', color: '#555' },
  barTrack: { flex: 1, height: '10px', background: '#f0f0f0', borderRadius: '5px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '5px', transition: 'width 0.4s' },
  barCount: { width: '30px', textAlign: 'right', fontSize: '0.85rem', color: '#555' },
  topItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f5f5f5' },
  rank: { width: '24px', height: '24px', background: '#e8f0fe', color: '#1a73e8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' },
  itemName: { flex: 1, fontSize: '0.9rem' },
  itemQty: { color: '#1a73e8', fontWeight: 'bold', fontSize: '0.85rem' },
  lowStockGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' },
  lowStockCard: { background: '#fff9f9', padding: '12px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }
};

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['all', 'general', 'paper', 'writing', 'binding', 'other'];
const PICKUP_SLOTS = ['Morning (9am-11am)', 'Afternoon (12pm-2pm)', 'Evening (3pm-5pm)'];

export default function PlaceOrder() {
  const [tab, setTab] = useState('stationery');
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({});
  const [files, setFiles] = useState([]);
  const [printSettings, setPrintSettings] = useState({ copies: 1, colorMode: 'black_white', pageSize: 'A4', doubleSided: false });
  const [notes, setNotes] = useState('');
  const [preferredPickup, setPreferredPickup] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/items').then(r => {
      setItems(r.data);
      // Check for reorder data
      const reorderRaw = sessionStorage.getItem('reorderData');
      if (reorderRaw) {
        const reorder = JSON.parse(reorderRaw);
        sessionStorage.removeItem('reorderData');
        const newCart = {};
        reorder.items?.forEach(oi => { if (oi.item?._id) newCart[oi.item._id] = oi.quantity; });
        setCart(newCart);
        setNotes(reorder.notes || '');
        if (reorder.type === 'print' || reorder.type === 'mixed') setTab(reorder.type);
        toast.success('Order prefilled from previous order');
      }
    });
  }, []);

  const updateCart = (id, qty, maxStock) => {
    setCart(prev => ({ ...prev, [id]: Math.min(maxStock, Math.max(0, qty)) }));
  };

  const cartTotal = items.reduce((sum, item) => sum + (cart[item._id] || 0) * item.price, 0);

  const filteredItems = items.filter(item => {
    const matchCat = category === 'all' || item.category === category;
    const matchSearch = search === '' || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      const orderItems = Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, quantity]) => ({ item: id, quantity }));

      const hasPrint = (tab === 'print' || tab === 'mixed') && files.length > 0;
      const hasItems = (tab === 'stationery' || tab === 'mixed') && orderItems.length > 0;

      if (!hasPrint && !hasItems) {
        toast.error('Please add items or upload files');
        setLoading(false);
        return;
      }

      const type = hasPrint && hasItems ? 'mixed' : hasPrint ? 'print' : 'stationery';
      formData.append('type', type);
      formData.append('items', JSON.stringify(orderItems));
      formData.append('notes', notes);
      formData.append('totalAmount', cartTotal);
      formData.append('preferredPickup', preferredPickup);

      if (hasPrint) {
        const printJobs = files.map(() => ({ ...printSettings }));
        formData.append('printJobs', JSON.stringify(printJobs));
        files.forEach(f => formData.append('files', f));
      }

      await api.post('/orders', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Order placed successfully!');
      navigate('/student/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Place New Order</h2>

      <div style={styles.tabs}>
        {['stationery', 'print', 'mixed'].map(t => (
          <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.activeTab : {}) }} onClick={() => setTab(t)}>
            {t === 'stationery' ? '🛒 Stationery' : t === 'print' ? '🖨️ Print' : '📦 Both'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {(tab === 'stationery' || tab === 'mixed') && (
          <div style={styles.section}>
            <h3>Select Items</h3>
            {/* Search & category filter */}
            <div style={styles.filterRow}>
              <input style={styles.searchInput} placeholder="Search items..." value={search}
                onChange={e => setSearch(e.target.value)} />
              <select style={styles.catSelect} value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            {filteredItems.length === 0 && <p style={{ color: '#999' }}>No items found.</p>}
            <div style={styles.itemGrid}>
              {filteredItems.map(item => (
                <div key={item._id} style={{ ...styles.itemCard, opacity: item.stock === 0 ? 0.5 : 1 }}>
                  <span style={styles.catBadge}>{item.category}</span>
                  <strong>{item.name}</strong>
                  <p style={styles.itemPrice}>₹{item.price}</p>
                  <p style={{ ...styles.itemStock, color: item.stock === 0 ? '#ef4444' : item.stock < 5 ? '#f59e0b' : '#999' }}>
                    {item.stock === 0 ? 'Out of stock' : `Stock: ${item.stock}`}
                  </p>
                  <div style={styles.qtyRow}>
                    <button type="button" style={styles.qtyBtn} disabled={item.stock === 0}
                      onClick={() => updateCart(item._id, (cart[item._id] || 0) - 1, item.stock)}>−</button>
                    <span style={styles.qty}>{cart[item._id] || 0}</span>
                    <button type="button" style={styles.qtyBtn} disabled={item.stock === 0 || (cart[item._id] || 0) >= item.stock}
                      onClick={() => updateCart(item._id, (cart[item._id] || 0) + 1, item.stock)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            {cartTotal > 0 && <p style={styles.total}>Total: ₹{cartTotal.toFixed(2)}</p>}
          </div>
        )}

        {(tab === 'print' || tab === 'mixed') && (
          <div style={styles.section}>
            <h3>Upload Documents</h3>
            <input type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg"
              onChange={e => setFiles(Array.from(e.target.files))} style={styles.fileInput} />
            {files.length > 0 && (
              <ul style={styles.fileList}>{files.map((f, i) => <li key={i}>{f.name}</li>)}</ul>
            )}
            <div style={styles.printOptions}>
              <label>Copies:
                <input type="number" min="1" value={printSettings.copies} style={styles.smallInput}
                  onChange={e => setPrintSettings({ ...printSettings, copies: +e.target.value })} />
              </label>
              <label>Color:
                <select value={printSettings.colorMode} style={styles.smallInput}
                  onChange={e => setPrintSettings({ ...printSettings, colorMode: e.target.value })}>
                  <option value="black_white">Black & White</option>
                  <option value="color">Color</option>
                </select>
              </label>
              <label>Size:
                <select value={printSettings.pageSize} style={styles.smallInput}
                  onChange={e => setPrintSettings({ ...printSettings, pageSize: e.target.value })}>
                  <option>A4</option><option>A3</option><option>Letter</option>
                </select>
              </label>
              <label>
                <input type="checkbox" checked={printSettings.doubleSided}
                  onChange={e => setPrintSettings({ ...printSettings, doubleSided: e.target.checked })} />
                &nbsp;Double-sided
              </label>
            </div>
          </div>
        )}

        <div style={styles.section}>
          <h3>Pickup Preference</h3>
          <div style={styles.slotRow}>
            {PICKUP_SLOTS.map(slot => (
              <button key={slot} type="button"
                style={{ ...styles.slotBtn, ...(preferredPickup === slot ? styles.activeSlot : {}) }}
                onClick={() => setPreferredPickup(preferredPickup === slot ? '' : slot)}>
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <label>Additional Notes (optional)</label>
          <textarea style={styles.textarea} value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Any special instructions..." rows={3} />
        </div>

        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '32px auto', padding: '0 20px' },
  title: { color: '#1a73e8', marginBottom: '20px' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '24px' },
  tab: { padding: '8px 20px', border: '2px solid #ddd', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '0.9rem' },
  activeTab: { borderColor: '#1a73e8', background: '#e8f0fe', color: '#1a73e8', fontWeight: 'bold' },
  section: { background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' },
  filterRow: { display: 'flex', gap: '10px', marginBottom: '12px' },
  searchInput: { flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' },
  catSelect: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' },
  itemGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' },
  itemCard: { border: '1px solid #eee', borderRadius: '8px', padding: '12px', textAlign: 'center', position: 'relative' },
  catBadge: { position: 'absolute', top: '6px', right: '6px', background: '#f0f0f0', color: '#888', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '8px' },
  itemPrice: { color: '#1a73e8', fontWeight: 'bold', margin: '4px 0' },
  itemStock: { fontSize: '0.8rem', margin: '0 0 8px' },
  qtyRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  qtyBtn: { width: '28px', height: '28px', border: '1px solid #ddd', borderRadius: '50%', background: '#f5f5f5', cursor: 'pointer', fontSize: '1rem' },
  qty: { minWidth: '20px', textAlign: 'center', fontWeight: 'bold' },
  total: { marginTop: '12px', fontWeight: 'bold', color: '#1a73e8', fontSize: '1.1rem' },
  fileInput: { marginTop: '8px', display: 'block' },
  fileList: { marginTop: '8px', paddingLeft: '20px', color: '#555' },
  printOptions: { display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '14px', alignItems: 'center' },
  smallInput: { marginLeft: '6px', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px' },
  slotRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' },
  slotBtn: { padding: '8px 16px', border: '2px solid #ddd', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '0.85rem' },
  activeSlot: { borderColor: '#1a73e8', background: '#e8f0fe', color: '#1a73e8', fontWeight: 'bold' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '8px', boxSizing: 'border-box', resize: 'vertical' },
  submitBtn: { width: '100%', padding: '13px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', marginTop: '8px' }
};

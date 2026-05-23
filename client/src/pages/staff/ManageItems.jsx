import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', price: '', stock: '', category: 'general' };

export default function ManageItems() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    const { data } = await api.get('/items');
    setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/items/${editId}`, form);
        toast.success('Item updated');
      } else {
        await api.post('/items', form);
        toast.success('Item added');
      }
      setForm(emptyForm);
      setEditId(null);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description || '', price: item.price, stock: item.stock, category: item.category });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      toast.success('Deleted');
      fetchItems();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Stationery Items</h2>

      <div style={styles.formCard}>
        <h3>{editId ? 'Edit Item' : 'Add New Item'}</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input style={styles.input} placeholder="Item name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input style={styles.input} placeholder="Description" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
          <input style={styles.input} type="number" placeholder="Price (₹)" value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })} required min="0" />
          <input style={styles.input} type="number" placeholder="Stock quantity" value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })} required min="0" />
          <select style={styles.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="general">General</option>
            <option value="paper">Paper</option>
            <option value="writing">Writing</option>
            <option value="binding">Binding</option>
            <option value="other">Other</option>
          </select>
          <div style={styles.btnRow}>
            <button type="submit" style={styles.addBtn} disabled={loading}>
              {loading ? 'Saving...' : editId ? 'Update Item' : 'Add Item'}
            </button>
            {editId && (
              <button type="button" style={styles.cancelBtn} onClick={() => { setForm(emptyForm); setEditId(null); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id} style={styles.tr}>
                <td><strong>{item.name}</strong><br /><span style={styles.desc}>{item.description}</span></td>
                <td>{item.category}</td>
                <td>₹{item.price}</td>
                <td style={{ color: item.stock < 5 ? '#ef4444' : '#333' }}>{item.stock}</td>
                <td>
                  <button style={styles.editBtn} onClick={() => handleEdit(item)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No items yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '32px auto', padding: '0 20px' },
  title: { color: '#1a73e8', marginBottom: '20px' },
  formCard: { background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', marginBottom: '24px' },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' },
  input: { padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' },
  btnRow: { gridColumn: '1 / -1', display: 'flex', gap: '10px' },
  addBtn: { padding: '10px 24px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { padding: '10px 20px', background: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' },
  tableWrap: { background: '#fff', borderRadius: '10px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8f9fa' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  desc: { color: '#999', fontSize: '0.8rem' },
  editBtn: { background: '#e8f0fe', color: '#1a73e8', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' },
  deleteBtn: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }
};

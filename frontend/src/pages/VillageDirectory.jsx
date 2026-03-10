import { useState, useEffect } from 'react';
import axios from 'axios';

const categoryConfig = {
    grocery: { emoji: '🛒', label: 'Grocery', color: '#16a34a' },
    medical: { emoji: '💊', label: 'Medical', color: '#ef4444' },
    hardware: { emoji: '🔩', label: 'Hardware', color: '#64748b' },
    clothing: { emoji: '👕', label: 'Clothing', color: '#8b5cf6' },
    food: { emoji: '🍽️', label: 'Food & Restaurant', color: '#f59e0b' },
    transport: { emoji: '🚗', label: 'Transport', color: '#3b82f6' },
    repair: { emoji: '🔧', label: 'Repair & Service', color: '#06b6d4' },
    agriculture: { emoji: '🌾', label: 'Agriculture', color: '#15803d' },
    education: { emoji: '📚', label: 'Education', color: '#6366f1' },
    other: { emoji: '🏪', label: 'Other', color: '#6b7280' },
};

function VillageDirectory({ user }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        businessName: '', ownerName: '', category: 'grocery',
        phone: '', address: '', wardNumber: '', timings: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchListings(); }, []);

    const fetchListings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/directory');
            setListings(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/directory', { ...form, userId: user?._id });
            setForm({ businessName: '', ownerName: '', category: 'grocery', phone: '', address: '', wardNumber: '', timings: '' });
            setShowForm(false);
            fetchListings();
        } catch (err) { alert('Error adding listing'); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this listing?')) return;
        try { await axios.delete(`http://localhost:5000/api/directory/${id}`); fetchListings(); }
        catch (err) { alert('Error deleting'); }
    };

    const isAdmin = user?.role === 'admin';

    const filtered = listings
        .filter(l => activeFilter === 'all' || l.category === activeFilter)
        .filter(l => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return l.businessName.toLowerCase().includes(term) || (l.ownerName && l.ownerName.toLowerCase().includes(term));
        });

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2>🏪 Village Directory</h2>
                    <p className="module-subtitle">Find local shops, services, and businesses in the village</p>
                </div>
                <button className="module-add-btn" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cancel' : '+ Add Business'}
                </button>
            </div>

            {/* Search */}
            <div className="directory-search">
                <input
                    type="text"
                    placeholder="🔍  Search businesses by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="filter-chips">
                <button className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All</button>
                {Object.entries(categoryConfig).map(([key, val]) => (
                    <button key={key} className={`filter-chip ${activeFilter === key ? 'active' : ''}`} onClick={() => setActiveFilter(key)}>
                        {val.emoji} {val.label}
                    </button>
                ))}
            </div>

            {showForm && (
                <div className="module-form-card">
                    <h3>Add Business Listing</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Business Name</label>
                                <input type="text" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="Shop or business name" required />
                            </div>
                            <div className="form-group">
                                <label>Owner Name</label>
                                <input type="text" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} placeholder="Owner / proprietor" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                    {Object.entries(categoryConfig).map(([key, val]) => (
                                        <option key={key} value={key}>{val.emoji} {val.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Contact number" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Address</label>
                                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Shop location" />
                            </div>
                            <div className="form-group">
                                <label>Ward Number</label>
                                <input type="number" value={form.wardNumber} onChange={(e) => setForm({ ...form, wardNumber: e.target.value })} placeholder="Ward #" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Working Hours</label>
                            <input type="text" value={form.timings} onChange={(e) => setForm({ ...form, timings: e.target.value })} placeholder="e.g., 9:00 AM – 8:00 PM" />
                        </div>
                        <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : '🏪 Add Business'}</button>
                    </form>
                </div>
            )}

            <div className="directory-grid">
                {loading ? (
                    <p className="module-empty">Loading directory...</p>
                ) : filtered.length === 0 ? (
                    <div className="module-empty-state">
                        <div className="module-empty-icon">🏪</div>
                        <p>{searchTerm ? 'No results found' : 'No businesses listed yet'}</p>
                    </div>
                ) : (
                    filtered.map((item, index) => {
                        const cat = categoryConfig[item.category] || categoryConfig.other;
                        return (
                            <div key={item._id} className="directory-card" style={{ animationDelay: `${index * 50}ms`, animation: 'slideIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
                                <div className="directory-card-icon" style={{ background: cat.color + '12', color: cat.color }}>
                                    {cat.emoji}
                                </div>
                                <div className="directory-card-body">
                                    <h4>{item.businessName}</h4>
                                    <span className="module-tag" style={{ background: cat.color + '18', color: cat.color, fontSize: '0.65rem' }}>
                                        {cat.label}
                                    </span>
                                    {item.ownerName && <p className="directory-owner">👤 {item.ownerName}</p>}
                                    <a href={`tel:${item.phone}`} className="contact-phone">📱 {item.phone}</a>
                                    {item.address && <p className="contact-address">📍 {item.address}</p>}
                                    {item.timings && <p className="directory-timing">🕐 {item.timings}</p>}
                                    {item.wardNumber && <span className="ward-badge" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>Ward {item.wardNumber}</span>}
                                </div>
                                {isAdmin && (
                                    <button className="module-delete-btn" onClick={() => handleDelete(item._id)}>🗑️</button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default VillageDirectory;

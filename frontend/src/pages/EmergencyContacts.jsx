import { useState, useEffect } from 'react';
import axios from 'axios';

const categoryConfig = {
    police: { emoji: '👮', label: 'Police', color: '#3b82f6' },
    hospital: { emoji: '🏥', label: 'Hospital', color: '#10b981' },
    fire: { emoji: '🚒', label: 'Fire Station', color: '#ef4444' },
    ambulance: { emoji: '🚑', label: 'Ambulance', color: '#f59e0b' },
    panchayat: { emoji: '🏛️', label: 'Panchayat', color: '#8b5cf6' },
    electricity: { emoji: '⚡', label: 'Electricity', color: '#eab308' },
    water: { emoji: '💧', label: 'Water Supply', color: '#06b6d4' },
    other: { emoji: '📞', label: 'Other', color: '#64748b' },
};

function EmergencyContacts({ user }) {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: '', category: 'police', phone: '', alternatePhone: '', address: '', isAvailable24x7: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    const isAdmin = user?.role === 'admin';

    useEffect(() => { fetchContacts(); }, []);

    const fetchContacts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/emergency-contacts');
            setContacts(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/emergency-contacts', { ...form, userId: user._id });
            setForm({ name: '', category: 'police', phone: '', alternatePhone: '', address: '', isAvailable24x7: false });
            setShowForm(false);
            fetchContacts();
        } catch (err) { alert('Error adding contact'); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this contact?')) return;
        try { await axios.delete(`http://localhost:5000/api/emergency-contacts/${id}`); fetchContacts(); }
        catch (err) { alert('Error deleting'); }
    };

    const filtered = activeFilter === 'all' ? contacts : contacts.filter(c => c.category === activeFilter);

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2>🆘 Emergency Contacts</h2>
                    <p className="module-subtitle">Important contacts for emergencies and village services</p>
                </div>
                {isAdmin && (
                    <button className="module-add-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? '✕ Cancel' : '+ Add Contact'}
                    </button>
                )}
            </div>

            {/* Filter chips */}
            <div className="filter-chips">
                <button className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All</button>
                {Object.entries(categoryConfig).map(([key, val]) => (
                    <button key={key} className={`filter-chip ${activeFilter === key ? 'active' : ''}`} onClick={() => setActiveFilter(key)}>
                        {val.emoji} {val.label}
                    </button>
                ))}
            </div>

            {showForm && isAdmin && (
                <div className="module-form-card">
                    <h3>Add Emergency Contact</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name / Organization</label>
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contact name" required />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                    {Object.entries(categoryConfig).map(([key, val]) => (
                                        <option key={key} value={key}>{val.emoji} {val.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Primary phone" required />
                            </div>
                            <div className="form-group">
                                <label>Alternate Phone</label>
                                <input type="tel" value={form.alternatePhone} onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })} placeholder="Optional" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Location / Address" />
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input type="checkbox" id="avail247" checked={form.isAvailable24x7} onChange={(e) => setForm({ ...form, isAvailable24x7: e.target.checked })} style={{ width: 'auto' }} />
                            <label htmlFor="avail247" style={{ margin: 0, textTransform: 'none', fontSize: '0.9rem' }}>Available 24×7</label>
                        </div>
                        <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : '📞 Add Contact'}</button>
                    </form>
                </div>
            )}

            <div className="contacts-grid">
                {loading ? (
                    <p className="module-empty">Loading contacts...</p>
                ) : filtered.length === 0 ? (
                    <div className="module-empty-state">
                        <div className="module-empty-icon">📞</div>
                        <p>No contacts found</p>
                    </div>
                ) : (
                    filtered.map((item, index) => {
                        const cat = categoryConfig[item.category] || categoryConfig.other;
                        return (
                            <div key={item._id} className="contact-card" style={{ animationDelay: `${index * 50}ms`, animation: 'slideIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
                                <div className="contact-icon" style={{ background: cat.color + '15', color: cat.color }}>
                                    {cat.emoji}
                                </div>
                                <div className="contact-info">
                                    <h4>{item.name}</h4>
                                    <span className="module-tag" style={{ background: cat.color + '18', color: cat.color, fontSize: '0.65rem' }}>
                                        {cat.label}
                                    </span>
                                    <a href={`tel:${item.phone}`} className="contact-phone">📱 {item.phone}</a>
                                    {item.alternatePhone && <a href={`tel:${item.alternatePhone}`} className="contact-phone secondary">📱 {item.alternatePhone}</a>}
                                    {item.address && <p className="contact-address">📍 {item.address}</p>}
                                    {item.isAvailable24x7 && <span className="badge-24x7">24×7</span>}
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

export default EmergencyContacts;

import { useState, useEffect } from 'react';
import axios from 'axios';

const categoryConfig = {
    agriculture: { emoji: '🌾', label: 'Agriculture', color: '#16a34a' },
    education: { emoji: '📚', label: 'Education', color: '#3b82f6' },
    health: { emoji: '🏥', label: 'Health', color: '#10b981' },
    housing: { emoji: '🏠', label: 'Housing', color: '#f59e0b' },
    employment: { emoji: '💼', label: 'Employment', color: '#8b5cf6' },
    women: { emoji: '👩', label: 'Women & Child', color: '#ec4899' },
    'senior-citizen': { emoji: '👴', label: 'Senior Citizen', color: '#64748b' },
    other: { emoji: '📋', label: 'Other', color: '#6b7280' },
};

function Schemes({ user }) {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', eligibility: '', benefits: '',
        category: 'other', applicationLink: '', deadline: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);

    const isAdmin = user?.role === 'admin';

    useEffect(() => { fetchSchemes(); }, []);

    const fetchSchemes = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/schemes');
            setSchemes(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/schemes', { ...form, userId: user._id });
            setForm({ title: '', description: '', eligibility: '', benefits: '', category: 'other', applicationLink: '', deadline: '' });
            setShowForm(false);
            fetchSchemes();
        } catch (err) { alert('Error adding scheme'); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this scheme?')) return;
        try { await axios.delete(`http://localhost:5000/api/schemes/${id}`); fetchSchemes(); }
        catch (err) { alert('Error deleting'); }
    };

    const filtered = activeFilter === 'all' ? schemes : schemes.filter(s => s.category === activeFilter);

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2>🏛️ Government Schemes</h2>
                    <p className="module-subtitle">Explore government schemes and benefits available for villagers</p>
                </div>
                {isAdmin && (
                    <button className="module-add-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? '✕ Cancel' : '+ Add Scheme'}
                    </button>
                )}
            </div>

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
                    <h3>Add Government Scheme</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Scheme Title</label>
                                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Scheme name" required />
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
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief about the scheme..." required rows="3" />
                        </div>
                        <div className="form-group">
                            <label>Eligibility</label>
                            <textarea value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} placeholder="Who can apply..." rows="2" />
                        </div>
                        <div className="form-group">
                            <label>Benefits</label>
                            <textarea value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder="What benefits are provided..." rows="2" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Application Link</label>
                                <input type="url" value={form.applicationLink} onChange={(e) => setForm({ ...form, applicationLink: e.target.value })} placeholder="https://..." />
                            </div>
                            <div className="form-group">
                                <label>Deadline</label>
                                <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                            </div>
                        </div>
                        <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : '📋 Add Scheme'}</button>
                    </form>
                </div>
            )}

            <div className="module-grid">
                {loading ? (
                    <p className="module-empty">Loading schemes...</p>
                ) : filtered.length === 0 ? (
                    <div className="module-empty-state">
                        <div className="module-empty-icon">📋</div>
                        <p>No schemes found</p>
                    </div>
                ) : (
                    filtered.map((item, index) => {
                        const cat = categoryConfig[item.category] || categoryConfig.other;
                        const isExpanded = expandedId === item._id;
                        const hasDeadline = item.deadline;
                        const deadlinePassed = hasDeadline && new Date(item.deadline) < new Date();
                        return (
                            <div
                                key={item._id}
                                className={`module-card scheme-card ${isExpanded ? 'expanded' : ''}`}
                                style={{ animationDelay: `${index * 60}ms`, borderLeftColor: cat.color }}
                            >
                                <div className="module-card-header">
                                    <span className="module-tag" style={{ background: cat.color + '18', color: cat.color }}>
                                        {cat.emoji} {cat.label}
                                    </span>
                                    {hasDeadline && (
                                        <span className="module-tag" style={{
                                            background: deadlinePassed ? '#fee2e2' : '#dbeafe',
                                            color: deadlinePassed ? '#ef4444' : '#3b82f6'
                                        }}>
                                            {deadlinePassed ? '⏰ Expired' : `📅 ${new Date(item.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                                        </span>
                                    )}
                                </div>
                                <h3 className="module-card-title">{item.title}</h3>
                                <p className="module-card-text">{item.description}</p>

                                <button
                                    className="scheme-expand-btn"
                                    onClick={() => setExpandedId(isExpanded ? null : item._id)}
                                    style={{ background: 'none', color: cat.color, padding: '4px 0', fontSize: '0.8rem', boxShadow: 'none' }}
                                >
                                    {isExpanded ? '▲ Show Less' : '▼ Show Details'}
                                </button>

                                {isExpanded && (
                                    <div className="scheme-details">
                                        {item.eligibility && (
                                            <div className="scheme-detail-block">
                                                <h4>✅ Eligibility</h4>
                                                <p>{item.eligibility}</p>
                                            </div>
                                        )}
                                        {item.benefits && (
                                            <div className="scheme-detail-block">
                                                <h4>🎁 Benefits</h4>
                                                <p>{item.benefits}</p>
                                            </div>
                                        )}
                                        {item.applicationLink && (
                                            <a href={item.applicationLink} target="_blank" rel="noreferrer" className="scheme-apply-link">
                                                🔗 Apply Online
                                            </a>
                                        )}
                                    </div>
                                )}

                                <div className="module-card-footer">
                                    <span className="module-author">Added by {item.addedBy?.username || 'Admin'}</span>
                                    {isAdmin && (
                                        <button className="module-delete-btn" onClick={() => handleDelete(item._id)}>🗑️</button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Schemes;

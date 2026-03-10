import { useState, useEffect } from 'react';
import axios from 'axios';

const categoryConfig = {
    general: { emoji: '📢', label: 'General', color: '#3b82f6' },
    urgent: { emoji: '🚨', label: 'Urgent', color: '#ef4444' },
    meeting: { emoji: '🤝', label: 'Meeting', color: '#8b5cf6' },
    holiday: { emoji: '🎉', label: 'Holiday', color: '#f59e0b' },
    maintenance: { emoji: '🔧', label: 'Maintenance', color: '#64748b' },
};

function Announcements({ user }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', category: 'general' });
    const [submitting, setSubmitting] = useState(false);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/announcements');
            setAnnouncements(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/announcements', {
                ...form,
                userId: user._id
            });
            setForm({ title: '', content: '', category: 'general' });
            setShowForm(false);
            fetchAnnouncements();
        } catch (err) {
            alert('Error posting announcement');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/announcements/${id}`);
            fetchAnnouncements();
        } catch (err) {
            alert('Error deleting');
        }
    };

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2>📢 Announcements & Notices</h2>
                    <p className="module-subtitle">Stay updated with the latest village announcements</p>
                </div>
                {isAdmin && (
                    <button className="module-add-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? '✕ Cancel' : '+ New Announcement'}
                    </button>
                )}
            </div>

            {showForm && isAdmin && (
                <div className="module-form-card">
                    <h3>Post New Announcement</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Announcement title"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                {Object.entries(categoryConfig).map(([key, val]) => (
                                    <option key={key} value={key}>{val.emoji} {val.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Content</label>
                            <textarea
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                placeholder="Write the announcement details..."
                                required
                                rows="4"
                            />
                        </div>
                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Posting...' : '📤 Post Announcement'}
                        </button>
                    </form>
                </div>
            )}

            <div className="module-grid">
                {loading ? (
                    <p className="module-empty">Loading announcements...</p>
                ) : announcements.length === 0 ? (
                    <div className="module-empty-state">
                        <div className="module-empty-icon">📭</div>
                        <p>No announcements yet</p>
                    </div>
                ) : (
                    announcements.map((item, index) => {
                        const cat = categoryConfig[item.category] || categoryConfig.general;
                        return (
                            <div
                                key={item._id}
                                className="module-card"
                                style={{ animationDelay: `${index * 60}ms`, borderLeftColor: cat.color }}
                            >
                                <div className="module-card-header">
                                    <span className="module-tag" style={{ background: cat.color + '18', color: cat.color }}>
                                        {cat.emoji} {cat.label}
                                    </span>
                                    <span className="module-date">
                                        {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <h3 className="module-card-title">{item.title}</h3>
                                <p className="module-card-text">{item.content}</p>
                                <div className="module-card-footer">
                                    <span className="module-author">Posted by {item.postedBy?.username || 'Admin'}</span>
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

export default Announcements;

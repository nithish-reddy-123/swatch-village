import { useState, useEffect } from 'react';
import axios from 'axios';

const categoryConfig = {
    festival: { emoji: '🎊', label: 'Festival', color: '#f59e0b' },
    meeting: { emoji: '🤝', label: 'Meeting', color: '#3b82f6' },
    'health-camp': { emoji: '🏥', label: 'Health Camp', color: '#10b981' },
    sports: { emoji: '🏏', label: 'Sports', color: '#8b5cf6' },
    cultural: { emoji: '🎭', label: 'Cultural', color: '#ec4899' },
    education: { emoji: '📚', label: 'Education', color: '#06b6d4' },
    other: { emoji: '📅', label: 'Other', color: '#64748b' },
};

function Events({ user }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', eventDate: '', eventTime: '',
        venue: '', category: 'other', organizer: 'Village Panchayat'
    });
    const [submitting, setSubmitting] = useState(false);

    const isAdmin = user?.role === 'admin';

    useEffect(() => { fetchEvents(); }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/events');
            setEvents(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/events', { ...form, userId: user._id });
            setForm({ title: '', description: '', eventDate: '', eventTime: '', venue: '', category: 'other', organizer: 'Village Panchayat' });
            setShowForm(false);
            fetchEvents();
        } catch (err) { alert('Error creating event'); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try { await axios.delete(`http://localhost:5000/api/events/${id}`); fetchEvents(); }
        catch (err) { alert('Error deleting'); }
    };

    const now = new Date();

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2>🎪 Community Events</h2>
                    <p className="module-subtitle">Upcoming events, festivals, and gatherings in the village</p>
                </div>
                {isAdmin && (
                    <button className="module-add-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? '✕ Cancel' : '+ New Event'}
                    </button>
                )}
            </div>

            {showForm && isAdmin && (
                <div className="module-form-card">
                    <h3>Create New Event</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Event Title</label>
                                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event name" required />
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
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Event details..." required rows="3" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date</label>
                                <input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Time</label>
                                <input type="time" value={form.eventTime} onChange={(e) => setForm({ ...form, eventTime: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Venue</label>
                                <input type="text" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Event location" required />
                            </div>
                            <div className="form-group">
                                <label>Organizer</label>
                                <input type="text" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} placeholder="Organizing body" />
                            </div>
                        </div>
                        <button type="submit" disabled={submitting}>{submitting ? 'Creating...' : '🎉 Create Event'}</button>
                    </form>
                </div>
            )}

            <div className="module-grid">
                {loading ? (
                    <p className="module-empty">Loading events...</p>
                ) : events.length === 0 ? (
                    <div className="module-empty-state">
                        <div className="module-empty-icon">📅</div>
                        <p>No events scheduled</p>
                    </div>
                ) : (
                    events.map((item, index) => {
                        const cat = categoryConfig[item.category] || categoryConfig.other;
                        const eventDate = new Date(item.eventDate);
                        const isPast = eventDate < now;
                        return (
                            <div
                                key={item._id}
                                className={`module-card event-card ${isPast ? 'past-event' : ''}`}
                                style={{ animationDelay: `${index * 60}ms`, borderLeftColor: cat.color }}
                            >
                                <div className="module-card-header">
                                    <span className="module-tag" style={{ background: cat.color + '18', color: cat.color }}>
                                        {cat.emoji} {cat.label}
                                    </span>
                                    {isPast && <span className="module-tag" style={{ background: '#fee2e2', color: '#ef4444' }}>Past</span>}
                                </div>
                                <h3 className="module-card-title">{item.title}</h3>
                                <p className="module-card-text">{item.description}</p>
                                <div className="event-details">
                                    <div className="event-detail-item">
                                        <span className="event-detail-icon">📅</span>
                                        <span>{eventDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    {item.eventTime && (
                                        <div className="event-detail-item">
                                            <span className="event-detail-icon">🕐</span>
                                            <span>{item.eventTime}</span>
                                        </div>
                                    )}
                                    <div className="event-detail-item">
                                        <span className="event-detail-icon">📍</span>
                                        <span>{item.venue}</span>
                                    </div>
                                    <div className="event-detail-item">
                                        <span className="event-detail-icon">🏛️</span>
                                        <span>{item.organizer}</span>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <div className="module-card-footer">
                                        <span />
                                        <button className="module-delete-btn" onClick={() => handleDelete(item._id)}>🗑️</button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Events;

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const quickLinks = [
    { path: '/dashboard', emoji: '📋', label: 'Report Issue', color: '#3b82f6', desc: 'Report a civic problem' },
    { path: '/announcements', emoji: '📢', label: 'Announcements', color: '#8b5cf6', desc: 'Latest village notices' },
    { path: '/events', emoji: '🎪', label: 'Events', color: '#ec4899', desc: 'Upcoming gatherings' },
    { path: '/emergency', emoji: '🆘', label: 'Emergency', color: '#ef4444', desc: 'Important contacts' },
    { path: '/schemes', emoji: '🏛️', label: 'Schemes', color: '#f59e0b', desc: 'Govt. benefits' },
    { path: '/directory', emoji: '🏪', label: 'Directory', color: '#10b981', desc: 'Local businesses' },
];

const villageImages = [
    {
        url: 'https://images.unsplash.com/photo-1625504615927-c14f4f309b63?w=800&q=80',
        caption: 'Our Beautiful Village Life',
    },
    {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
        caption: 'Green Fields & Farmlands',
    },
    {
        url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
        caption: 'Harvest Season Joy',
    },
    {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
        caption: 'Village Community Together',
    },
];

const tips = [
    '💡 Keep your surroundings clean — report garbage dumping issues through the app.',
    '💧 Save water — report any leaking pipes or broken taps immediately.',
    '🌳 Plant a tree this season and help make our village greener!',
    '🚶 Walk or cycle for short distances — stay healthy, reduce pollution.',
    '📱 Share the Swatch Village app with your neighbors for a connected community.',
    '🔦 Report broken streetlights so they can be fixed before nightfall.',
];

function Home({ user }) {
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [dailyTip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

    const dashLink = user?.role === 'admin' ? '/admin' : '/dashboard';
    const greeting = getGreeting();

    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:5000/api/announcements').catch(() => ({ data: [] })),
            axios.get('http://localhost:5000/api/events').catch(() => ({ data: [] })),
        ]).then(([annRes, evtRes]) => {
            setAnnouncements(annRes.data.slice(0, 4));
            setEvents(evtRes.data.slice(0, 3));
        }).finally(() => setLoading(false));
    }, []);

    // Auto-slide
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % villageImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="home-page">
            {/* Welcome Banner with Slideshow */}
            <section className="home-banner">
                <div className="home-slideshow">
                    {villageImages.map((img, i) => (
                        <div
                            key={i}
                            className={`home-slide ${i === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${img.url})` }}
                        />
                    ))}
                    <div className="home-slide-overlay" />
                    <div className="home-banner-content">
                        <p className="home-greeting">{greeting}</p>
                        <h1>Welcome back, <span>{user?.username}</span> 👋</h1>
                        <p className="home-banner-sub">
                            {user?.role === 'admin'
                                ? 'Manage your village, review issues, and keep the community informed.'
                                : `Ward ${user?.wardNumber} · Stay connected with your village community.`
                            }
                        </p>
                        <Link to={dashLink} className="home-dash-btn">
                            {user?.role === 'admin' ? '🛡️ Admin Dashboard' : '📋 My Dashboard'} →
                        </Link>
                    </div>
                    <div className="home-slide-dots">
                        {villageImages.map((_, i) => (
                            <button
                                key={i}
                                className={`home-dot ${i === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(i)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Daily Tip */}
            <section className="home-tip">
                <div className="home-tip-card">
                    <span className="home-tip-label">🌟 Tip of the Day</span>
                    <p>{dailyTip}</p>
                </div>
            </section>

            {/* Quick Access Grid */}
            <section className="home-quick">
                <h2>Quick Access</h2>
                <div className="home-quick-grid">
                    {quickLinks.map((ql, i) => (
                        <Link
                            key={i}
                            to={ql.path === '/dashboard' ? dashLink : ql.path}
                            className="home-quick-card"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="home-quick-icon" style={{ background: ql.color + '14', color: ql.color }}>
                                {ql.emoji}
                            </div>
                            <div className="home-quick-info">
                                <h3>{ql.label}</h3>
                                <p>{ql.desc}</p>
                            </div>
                            <span className="home-quick-arrow" style={{ color: ql.color }}>→</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* News & Updates — 2 Column */}
            <section className="home-news">
                {/* Announcements Column */}
                <div className="home-news-col">
                    <div className="home-news-header">
                        <h2>📢 Latest Announcements</h2>
                        <Link to="/announcements" className="home-see-all">See All →</Link>
                    </div>
                    {loading ? (
                        <div className="home-news-loading">Loading...</div>
                    ) : announcements.length === 0 ? (
                        <div className="home-news-empty">
                            <p>📭 No announcements yet</p>
                        </div>
                    ) : (
                        <div className="home-news-list">
                            {announcements.map((a, i) => (
                                <div key={a._id} className="home-news-item" style={{ animationDelay: `${i * 80}ms` }}>
                                    <div className="home-news-dot" style={{ background: getCategoryColor(a.category) }} />
                                    <div className="home-news-body">
                                        <h4>{a.title}</h4>
                                        <p>{a.content?.substring(0, 100)}{a.content?.length > 100 ? '...' : ''}</p>
                                        <span className="home-news-date">
                                            {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Events Column */}
                <div className="home-news-col">
                    <div className="home-news-header">
                        <h2>🎪 Upcoming Events</h2>
                        <Link to="/events" className="home-see-all">See All →</Link>
                    </div>
                    {loading ? (
                        <div className="home-news-loading">Loading...</div>
                    ) : events.length === 0 ? (
                        <div className="home-news-empty">
                            <p>📅 No upcoming events</p>
                        </div>
                    ) : (
                        <div className="home-news-list">
                            {events.map((ev, i) => {
                                const d = new Date(ev.eventDate);
                                return (
                                    <div key={ev._id} className="home-event-item" style={{ animationDelay: `${i * 80}ms` }}>
                                        <div className="home-event-date-box">
                                            <span className="home-event-month">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
                                            <span className="home-event-day">{d.getDate()}</span>
                                        </div>
                                        <div className="home-news-body">
                                            <h4>{ev.title}</h4>
                                            <p>📍 {ev.venue}{ev.eventTime ? ` · 🕐 ${ev.eventTime}` : ''}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Village Gallery */}
            <section className="home-gallery">
                <h2>🏘️ Village Glimpses</h2>
                <div className="home-gallery-grid">
                    {villageImages.map((img, i) => (
                        <div key={i} className="home-gallery-item" style={{ animationDelay: `${i * 100}ms` }}>
                            <img src={img.url} alt={img.caption} loading="lazy" />
                            <div className="home-gallery-caption">{img.caption}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <p>🏘️ Swatch Village · Serving our community with ❤️ · © {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return '🌅 Good Morning';
    if (h < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
}

function getCategoryColor(cat) {
    const map = {
        general: '#3b82f6', urgent: '#ef4444', meeting: '#8b5cf6',
        holiday: '#f59e0b', maintenance: '#64748b',
    };
    return map[cat] || '#3b82f6';
}

export default Home;

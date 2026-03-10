import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../AppContext';

function Home({ user }) {
    const { t } = useApp();
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    const quickLinks = [
        { path: '/dashboard', emoji: '📋', labelKey: 'reportIssue', color: '#3b82f6', descKey: 'reportCivicProblem' },
        { path: '/announcements', emoji: '📢', labelKey: 'announcements', color: '#8b5cf6', descKey: 'latestNotices' },
        { path: '/events', emoji: '🎪', labelKey: 'events', color: '#ec4899', descKey: 'upcomingGatherings' },
        { path: '/emergency', emoji: '🆘', labelKey: 'emergency', color: '#ef4444', descKey: 'importantContacts' },
        { path: '/schemes', emoji: '🏛️', labelKey: 'schemes', color: '#f59e0b', descKey: 'govtBenefits' },
        { path: '/directory', emoji: '🏪', labelKey: 'directory', color: '#10b981', descKey: 'localBusinesses' },
    ];

    const villageImages = [
        { url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80', captionKey: 'ourBeautifulVillage' },
        { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80', captionKey: 'greenFields' },
        { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80', captionKey: 'harvestSeason' },
        { url: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1200&q=80', captionKey: 'villageCommunity' },
    ];

    const tipKeys = ['tip1', 'tip2', 'tip3', 'tip4', 'tip5', 'tip6'];
    const [dailyTipKey] = useState(() => tipKeys[Math.floor(Math.random() * tipKeys.length)]);

    const dashLink = user?.role === 'admin' ? '/admin' : '/dashboard';

    function getGreeting() {
        const h = new Date().getHours();
        if (h < 12) return `🌅 ${t('goodMorning')}`;
        if (h < 17) return `☀️ ${t('goodAfternoon')}`;
        return `🌙 ${t('goodEvening')}`;
    }

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
                        <p className="home-greeting">{getGreeting()}</p>
                        <h1>{t('welcomeBack')} <span>{user?.username}</span> 👋</h1>
                        <p className="home-banner-sub">
                            {user?.role === 'admin'
                                ? t('adminBannerSub')
                                : `${t('ward')} ${user?.wardNumber} · ${t('citizenBannerSub')}`
                            }
                        </p>
                        <Link to={dashLink} className="home-dash-btn">
                            {user?.role === 'admin' ? `🛡️ ${t('adminDashboard')}` : `📋 ${t('myDashboard')}`} →
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
                    <span className="home-tip-label">🌟 {t('tipOfTheDay')}</span>
                    <p>{t(dailyTipKey)}</p>
                </div>
            </section>

            {/* Quick Access Grid */}
            <section className="home-quick">
                <h2>{t('quickAccess')}</h2>
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
                                <h3>{t(ql.labelKey)}</h3>
                                <p>{t(ql.descKey)}</p>
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
                        <h2>📢 {t('latestAnnouncements')}</h2>
                        <Link to="/announcements" className="home-see-all">{t('seeAll')} →</Link>
                    </div>
                    {loading ? (
                        <div className="home-news-loading">{t('loading')}</div>
                    ) : announcements.length === 0 ? (
                        <div className="home-news-empty">
                            <p>📭 {t('noAnnouncements')}</p>
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
                        <h2>🎪 {t('upcomingEvents')}</h2>
                        <Link to="/events" className="home-see-all">{t('seeAll')} →</Link>
                    </div>
                    {loading ? (
                        <div className="home-news-loading">{t('loading')}</div>
                    ) : events.length === 0 ? (
                        <div className="home-news-empty">
                            <p>📅 {t('noUpcomingEvents')}</p>
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
                <h2>🏘️ {t('villageGlimpses')}</h2>
                <div className="home-gallery-grid">
                    {villageImages.map((img, i) => (
                        <div key={i} className="home-gallery-item" style={{ animationDelay: `${i * 100}ms` }}>
                            <img src={img.url} alt={t(img.captionKey)} loading="lazy" />
                            <div className="home-gallery-caption">{t(img.captionKey)}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <p>🏘️ {t('appName')} · {t('servingCommunity')} · © {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}

function getCategoryColor(cat) {
    const map = {
        general: '#3b82f6', urgent: '#ef4444', meeting: '#8b5cf6',
        holiday: '#f59e0b', maintenance: '#64748b',
    };
    return map[cat] || '#3b82f6';
}

export default Home;

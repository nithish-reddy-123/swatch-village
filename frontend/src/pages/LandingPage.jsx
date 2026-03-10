import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';

function LandingPage({ user }) {
    const { t, lang, theme, toggleLang, toggleTheme } = useApp();
    const isLoggedIn = !!user;
    const dashLink = user?.role === 'admin' ? '/admin' : '/dashboard';

    const features = [
        { emoji: '📋', title: t('reportIssues'), desc: t('reportIssuesDesc'), color: '#3b82f6' },
        { emoji: '📢', title: t('announcements'), desc: t('announcementsDesc'), color: '#8b5cf6' },
        { emoji: '🎪', title: t('communityEvents'), desc: t('communityEventsDesc'), color: '#ec4899' },
        { emoji: '🆘', title: t('emergencyContacts'), desc: t('emergencyContactsDesc'), color: '#ef4444' },
        { emoji: '🏛️', title: t('governmentSchemes'), desc: t('governmentSchemesDesc'), color: '#f59e0b' },
        { emoji: '🏪', title: t('villageDirectory'), desc: t('villageDirectoryDesc'), color: '#10b981' },
    ];

    const stats = [
        { value: '100%', label: t('transparent') },
        { value: '24/7', label: t('accessible') },
        { value: '🤖', label: t('aiChatbot') },
        { value: '📍', label: t('gpsTracking') },
    ];

    const featureLinks = {
        [t('reportIssues')]: '/dashboard',
        [t('announcements')]: '/announcements',
        [t('communityEvents')]: '/events',
        [t('emergencyContacts')]: '/emergency',
        [t('governmentSchemes')]: '/schemes',
        [t('villageDirectory')]: '/directory',
    };

    return (
        <div className="landing">
            {/* Floating toggles for landing page (no navbar) */}
            <div className="landing-toggles">
                <button className="toggle-btn" onClick={toggleLang} title="Switch language">
                    <span className="toggle-icon">🌐</span> {lang === 'en' ? 'తెలుగు' : 'ENG'}
                </button>
                <button className="toggle-btn" onClick={toggleTheme} title="Switch theme">
                    <span className="toggle-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
                    {theme === 'light' ? t('darkMode') : t('lightMode')}
                </button>
            </div>

            {/* Hero */}
            <section className="landing-hero">
                <div className="landing-hero-bg" />
                <div className="landing-hero-content">
                    <span className="landing-badge">🏘️ {t('digitalVillagePlatform')}</span>
                    <h1>
                        {t('welcomeTo')} <span className="landing-brand">{t('appName')}</span>
                    </h1>
                    <p className="landing-tagline">{t('landingTagline')}</p>
                    <div className="landing-cta">
                        {isLoggedIn ? (
                            <Link to={dashLink} className="landing-btn primary">
                                {t('goToDashboard')} →
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="landing-btn primary">
                                    👤 {t('citizenLogin')}
                                </Link>
                                <Link to="/admin-login" className="landing-btn secondary">
                                    🛡️ {t('adminLogin')}
                                </Link>
                            </>
                        )}
                        <a href="#features" className="landing-btn outline">
                            {t('exploreFeatures')} ↓
                        </a>
                    </div>
                </div>
                <div className="landing-hero-visual">
                    <div className="landing-preview-card">
                        <div className="landing-preview-header">
                            <span className="landing-preview-dot red"></span>
                            <span className="landing-preview-dot yellow"></span>
                            <span className="landing-preview-dot green"></span>
                            <span className="landing-preview-title">{t('appName')}</span>
                        </div>
                        <div className="landing-preview-body">
                            <div className="landing-preview-row">
                                <span className="landing-preview-icon" style={{background:'#fbbf2420',color:'#fbbf24'}}>📋</span>
                                <div className="landing-preview-info">
                                    <span className="landing-preview-label">{t('issueReported')}</span>
                                    <span className="landing-preview-status pending">{t('pending') || 'Pending'}</span>
                                </div>
                            </div>
                            <div className="landing-preview-row">
                                <span className="landing-preview-icon" style={{background:'#10b98120',color:'#10b981'}}>✅</span>
                                <div className="landing-preview-info">
                                    <span className="landing-preview-label">{t('problemSolved')}</span>
                                    <span className="landing-preview-status solved">{t('resolved') || 'Resolved'}</span>
                                </div>
                            </div>
                            <div className="landing-preview-row">
                                <span className="landing-preview-icon" style={{background:'#8b5cf620',color:'#8b5cf6'}}>📢</span>
                                <div className="landing-preview-info">
                                    <span className="landing-preview-label">{t('newAnnouncement')}</span>
                                    <span className="landing-preview-status new">{t('new') || 'New'}</span>
                                </div>
                            </div>
                            <div className="landing-preview-row">
                                <span className="landing-preview-icon" style={{background:'#3b82f620',color:'#3b82f6'}}>🎪</span>
                                <div className="landing-preview-info">
                                    <span className="landing-preview-label">{t('communityEvents')}</span>
                                    <span className="landing-preview-status upcoming">{t('upcoming') || 'Upcoming'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="landing-stats">
                {stats.map((s, i) => (
                    <div key={i} className="landing-stat">
                        <div className="landing-stat-value">{s.value}</div>
                        <div className="landing-stat-label">{s.label}</div>
                    </div>
                ))}
            </section>

            {/* Features */}
            <section className="landing-features" id="features">
                <h2>{t('everythingVillageNeeds')}</h2>
                <p className="landing-features-sub">{t('featuresSubtitle')}</p>
                <div className="landing-features-grid">
                    {features.map((f, i) => (
                        <Link
                            key={i}
                            to={isLoggedIn ? (featureLinks[f.title] || dashLink) : '/login'}
                            className="landing-feature-card"
                            style={{ animationDelay: `${i * 80}ms`, textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="landing-feature-icon" style={{ background: f.color + '14', color: f.color }}>
                                {f.emoji}
                            </div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="landing-how">
                <h2>{t('howItWorks')}</h2>
                <div className="landing-steps">
                    <div className="landing-step">
                        <div className="landing-step-num">1</div>
                        <h3>{t('signUp')}</h3>
                        <p>{t('signUpDesc')}</p>
                    </div>
                    <div className="landing-step-arrow">→</div>
                    <div className="landing-step">
                        <div className="landing-step-num">2</div>
                        <h3>{t('reportAndExplore')}</h3>
                        <p>{t('reportAndExploreDesc')}</p>
                    </div>
                    <div className="landing-step-arrow">→</div>
                    <div className="landing-step">
                        <div className="landing-step-num">3</div>
                        <h3>{t('trackAndResolve')}</h3>
                        <p>{t('trackAndResolveDesc')}</p>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="landing-cta-banner">
                <h2>{isLoggedIn ? t('exploreVillageDashboard') : t('readyToMakeSmarter')}</h2>
                <p>{isLoggedIn ? t('accessAllServices') : t('joinSwatchVillage')}</p>
                {isLoggedIn ? (
                    <Link to={dashLink} className="landing-btn primary large">
                        {t('openDashboard')} →
                    </Link>
                ) : (
                    <div className="landing-cta" style={{ justifyContent: 'center' }}>
                        <Link to="/login" className="landing-btn primary large">
                            👤 {t('citizenSignUp')}
                        </Link>
                        <Link to="/admin-login" className="landing-btn secondary large">
                            🛡️ {t('adminLogin')}
                        </Link>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer-brand">🏘️ {t('appName')}</div>
                <p>{t('builtWithLove')} · © {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}

export default LandingPage;

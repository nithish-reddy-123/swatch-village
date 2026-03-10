import { Link } from 'react-router-dom';
import { useMemo } from 'react';

const features = [
    {
        emoji: '📋',
        title: 'Report Issues',
        desc: 'Report civic problems like road damage, water supply issues, and more with photos and GPS location.',
        color: '#3b82f6',
    },
    {
        emoji: '📢',
        title: 'Announcements',
        desc: 'Stay informed with the latest notices, urgent alerts, and panchayat meeting updates.',
        color: '#8b5cf6',
    },
    {
        emoji: '🎪',
        title: 'Community Events',
        desc: 'Discover upcoming festivals, health camps, sports events, and cultural gatherings in the village.',
        color: '#ec4899',
    },
    {
        emoji: '🆘',
        title: 'Emergency Contacts',
        desc: 'Quick access to police, hospital, fire station, ambulance, and essential village service numbers.',
        color: '#ef4444',
    },
    {
        emoji: '🏛️',
        title: 'Government Schemes',
        desc: 'Explore government benefits and schemes available for agriculture, health, education, and more.',
        color: '#f59e0b',
    },
    {
        emoji: '🏪',
        title: 'Village Directory',
        desc: 'Find local shops, services, medical stores, and businesses right in your neighborhood.',
        color: '#10b981',
    },
];

const stats = [
    { value: '100%', label: 'Transparent' },
    { value: '24/7', label: 'Accessible' },
    { value: '🤖', label: 'AI Chatbot' },
    { value: '📍', label: 'GPS Tracking' },
];

const featureLinks = {
    'Report Issues': '/dashboard',
    'Announcements': '/announcements',
    'Community Events': '/events',
    'Emergency Contacts': '/emergency',
    'Government Schemes': '/schemes',
    'Village Directory': '/directory',
};

function LandingPage({ user }) {
    const isLoggedIn = !!user;
    const dashLink = user?.role === 'admin' ? '/admin' : '/dashboard';

    return (
        <div className="landing">
            {/* Hero */}
            <section className="landing-hero">
                <div className="landing-hero-bg" />
                <div className="landing-hero-content">
                    <span className="landing-badge">🏘️ Digital Village Platform</span>
                    <h1>
                        Welcome to <span className="landing-brand">Swatch Village</span>
                    </h1>
                    <p className="landing-tagline">
                        Empowering villages with technology — report problems, stay informed, 
                        access services, and build a better community together.
                    </p>
                    <div className="landing-cta">
                        {isLoggedIn ? (
                            <Link to={dashLink} className="landing-btn primary">
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <Link to="/login" className="landing-btn primary">
                                Get Started →
                            </Link>
                        )}
                        <a href="#features" className="landing-btn secondary">
                            Explore Features
                        </a>
                    </div>
                </div>
                <div className="landing-hero-visual">
                    <div className="landing-hero-card c1">📋 Issue Reported</div>
                    <div className="landing-hero-card c2">✅ Problem Solved</div>
                    <div className="landing-hero-card c3">📢 New Announcement</div>
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
                <h2>Everything Your Village Needs</h2>
                <p className="landing-features-sub">
                    A complete digital ecosystem to connect villagers, administrators, and services.
                </p>
                <div className="landing-features-grid">
                    {features.map((f, i) => (
                        <Link
                            key={i}
                            to={isLoggedIn ? (featureLinks[f.title] || dashLink) : '/login'}
                            className="landing-feature-card"
                            style={{ animationDelay: `${i * 80}ms`, textDecoration: 'none', color: 'inherit' }}
                        >
                            <div
                                className="landing-feature-icon"
                                style={{ background: f.color + '14', color: f.color }}
                            >
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
                <h2>How It Works</h2>
                <div className="landing-steps">
                    <div className="landing-step">
                        <div className="landing-step-num">1</div>
                        <h3>Sign Up</h3>
                        <p>Create your account with your ward number to get started in seconds.</p>
                    </div>
                    <div className="landing-step-arrow">→</div>
                    <div className="landing-step">
                        <div className="landing-step-num">2</div>
                        <h3>Report & Explore</h3>
                        <p>Report problems, browse events, find contacts, and discover government schemes.</p>
                    </div>
                    <div className="landing-step-arrow">→</div>
                    <div className="landing-step">
                        <div className="landing-step-num">3</div>
                        <h3>Track & Resolve</h3>
                        <p>Admins resolve issues, post announcements, and keep the village running smoothly.</p>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="landing-cta-banner">
                <h2>{isLoggedIn ? 'Explore Your Village Dashboard' : 'Ready to Make Your Village Smarter?'}</h2>
                <p>{isLoggedIn ? 'Access all services, report issues, and stay connected with your community.' : 'Join Swatch Village today and be part of the digital transformation.'}</p>
                <Link to={isLoggedIn ? dashLink : '/login'} className="landing-btn primary large">
                    {isLoggedIn ? 'Open Dashboard →' : 'Create Your Account →'}
                </Link>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer-brand">🏘️ Swatch Village</div>
                <p>Built with ❤️ for Indian villages · © {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}

export default LandingPage;

import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Announcements from './pages/Announcements';
import Events from './pages/Events';
import EmergencyContacts from './pages/EmergencyContacts';
import Schemes from './pages/Schemes';
import VillageDirectory from './pages/VillageDirectory';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Chatbot from './components/Chatbot';
import { useApp } from './AppContext';
import { useState, useEffect } from 'react';

const navLinkKeys = [
    { path: '/announcements', key: 'announcements', emoji: '📢' },
    { path: '/events', key: 'events', emoji: '🎪' },
    { path: '/emergency', key: 'emergency', emoji: '🆘' },
    { path: '/schemes', key: 'schemes', emoji: '🏛️' },
    { path: '/directory', key: 'directory', emoji: '🏪' },
];

function NavBar({ user, onLogout }) {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const { t, lang, theme, toggleLang, toggleTheme } = useApp();

    const toggleControls = (
        <div className="nav-toggles">
            <button className="toggle-btn" onClick={toggleLang} title="Switch language">
                <span className="toggle-icon">🌐</span> {lang === 'en' ? 'తెలుగు' : 'ENG'}
            </button>
            <button className="toggle-btn" onClick={toggleTheme} title="Switch theme">
                <span className="toggle-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
                {theme === 'light' ? t('darkMode') : t('lightMode')}
            </button>
        </div>
    );

    // Hide navbar on landing page for non-logged-in users
    if (!user && location.pathname === '/') return null;

    if (!user) return (
        <nav className="navbar">
            <Link to="/" style={{ textDecoration: 'none' }}><h1>🏘️ {t('appName')}</h1></Link>
            {toggleControls}
        </nav>
    );

    const dashLink = user.role === 'admin' ? '/admin' : '/dashboard';

    return (
        <nav className="navbar">
            <Link to="/" style={{ textDecoration: 'none' }}><h1>🏘️ {t('appName')}</h1></Link>
            <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                {menuOpen ? '✕' : '☰'}
            </button>
            <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                    🏠 {t('home')}
                </Link>
                <Link to={dashLink} className={`nav-link ${location.pathname === dashLink ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                    {user.role === 'admin' ? '🛡️' : '📋'} {t('dashboard')}
                </Link>
                {navLinkKeys.map(nl => (
                    <Link key={nl.path} to={nl.path} className={`nav-link ${location.pathname === nl.path ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                        {nl.emoji} {t(nl.key)}
                    </Link>
                ))}
            </div>
            <div className="nav-user">
                {toggleControls}
                <span className="nav-user-info">
                    {user.role === 'admin' ? '🛡️' : '👤'} {user.username}
                    &nbsp;·&nbsp;
                    {user.role === 'admin' ? t('admin') : `${t('ward')} ${user.wardNumber}`}
                </span>
                <button onClick={onLogout}>{t('logout')}</button>
            </div>
        </nav>
    );
}

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <Router>
            <div className="app-container">
                <NavBar user={user} onLogout={handleLogout} />
                <Routes>
                    <Route
                        path="/"
                        element={user ? <Home user={user} /> : <LandingPage />}
                    />
                    <Route
                        path="/login"
                        element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/admin-login"
                        element={!user ? <AdminLogin onLogin={handleLogin} /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/dashboard"
                        element={user && user.role === 'user' ? <UserDashboard user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/admin"
                        element={user && user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/announcements"
                        element={user ? <Announcements user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/events"
                        element={user ? <Events user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/emergency"
                        element={user ? <EmergencyContacts user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/schemes"
                        element={user ? <Schemes user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/directory"
                        element={user ? <VillageDirectory user={user} /> : <Navigate to="/login" />}
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Chatbot />
            </div>
        </Router>
    );
}

export default App;

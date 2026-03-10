import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Announcements from './pages/Announcements';
import Events from './pages/Events';
import EmergencyContacts from './pages/EmergencyContacts';
import Schemes from './pages/Schemes';
import VillageDirectory from './pages/VillageDirectory';
import LandingPage from './pages/LandingPage';
import Chatbot from './components/Chatbot';
import { useState, useEffect } from 'react';

const navLinks = [
    { path: '/announcements', label: 'Announcements', emoji: '📢' },
    { path: '/events', label: 'Events', emoji: '🎪' },
    { path: '/emergency', label: 'Emergency', emoji: '🆘' },
    { path: '/schemes', label: 'Schemes', emoji: '🏛️' },
    { path: '/directory', label: 'Directory', emoji: '🏪' },
];

function NavBar({ user, onLogout }) {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    // Hide navbar entirely on landing page
    if (!user && location.pathname === '/') return null;

    if (!user) return (
        <nav className="navbar">
            <Link to="/" style={{ textDecoration: 'none' }}><h1>🏘️ Swatch Village</h1></Link>
        </nav>
    );

    const dashLink = user.role === 'admin' ? '/admin' : '/dashboard';

    return (
        <nav className="navbar">
            <Link to="/" style={{ textDecoration: 'none' }}><h1>🏘️ Swatch Village</h1></Link>
            <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                {menuOpen ? '✕' : '☰'}
            </button>
            <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                <Link to={dashLink} className={`nav-link ${location.pathname === dashLink ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                    {user.role === 'admin' ? '🛡️' : '📋'} Dashboard
                </Link>
                {navLinks.map(nl => (
                    <Link key={nl.path} to={nl.path} className={`nav-link ${location.pathname === nl.path ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                        {nl.emoji} {nl.label}
                    </Link>
                ))}
            </div>
            <div className="nav-user">
                <span className="nav-user-info">
                    {user.role === 'admin' ? '🛡️' : '👤'} {user.username}
                    &nbsp;·&nbsp;
                    {user.role === 'admin' ? 'Admin' : `Ward ${user.wardNumber}`}
                </span>
                <button onClick={onLogout}>Logout</button>
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
                        element={!user ? <LandingPage /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />}
                    />
                    <Route
                        path="/login"
                        element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />}
                    />
                    <Route
                        path="/dashboard"
                        element={user && user.role === 'user' ? <UserDashboard user={user} /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/admin"
                        element={user && user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />}
                    />
                    {/* New Module Routes — accessible to all logged-in users */}
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

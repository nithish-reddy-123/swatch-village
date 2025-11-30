import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useState, useEffect } from 'react';

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
                <nav className="navbar">
                    <h1>Swatch Village</h1>
                    {user && (
                        <div className="nav-user">
                            <span>Welcome, {user.username} ({user.role})</span>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </nav>
                <Routes>
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
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

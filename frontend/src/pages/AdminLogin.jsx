import { useState } from 'react';
import axios from 'axios';

function AdminLogin({ onLogin }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);

            if (res.data.role !== 'admin') {
                setError('This portal is for administrators only.');
                setIsLoading(false);
                return;
            }

            onLogin(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container admin-login">
                <div className="admin-login-badge">🛡️</div>
                <h2>Admin Portal</h2>
                <p className="login-subtitle">
                    Authorized personnel only. Enter your admin credentials to access the management dashboard.
                </p>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Admin Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Enter admin username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter admin password"
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: 8 }}>
                        {isLoading ? 'Authenticating...' : '🔐 Sign In as Admin'}
                    </button>
                </form>

                <p className="admin-login-note">
                    👤 Are you a citizen? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;

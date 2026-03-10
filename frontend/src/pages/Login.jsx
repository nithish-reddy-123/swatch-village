import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        wardNumber: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const endpoint = isRegistering
                ? 'http://localhost:5000/api/auth/register'
                : 'http://localhost:5000/api/auth/login';

            const payload = isRegistering
                ? { username: formData.username, password: formData.password, role: 'user', wardNumber: formData.wardNumber }
                : { username: formData.username, password: formData.password };

            const res = await axios.post(endpoint, payload);

            if (isRegistering) {
                setIsRegistering(false);
                setFormData({ username: '', password: '', wardNumber: '' });
                alert('Registration successful! Please login.');
            } else {
                if (res.data.role === 'admin') {
                    setError('Admins must use the Admin Portal to sign in.');
                    setIsLoading(false);
                    return;
                }
                onLogin(res.data);
            }
        } catch (err) {
            console.log('Error during authentication:', err);
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container citizen-login">
                <div className="citizen-login-badge">👤</div>
                <h2>{isRegistering ? '✨ Create Citizen Account' : '👋 Citizen Login'}</h2>
                <p className="login-subtitle">
                    {isRegistering
                        ? 'Join your community and help make your village better.'
                        : 'Sign in to report issues and track progress in your village.'}
                </p>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {isRegistering && (
                        <div className="form-group">
                            <label>Ward Number</label>
                            <input
                                type="number"
                                value={formData.wardNumber}
                                onChange={(e) => setFormData({ ...formData, wardNumber: e.target.value })}
                                placeholder="Enter your ward number"
                                required
                            />
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: 8 }}>
                        {isLoading
                            ? (isRegistering ? 'Creating Account...' : 'Signing In...')
                            : (isRegistering ? 'Create Account' : 'Sign In as Citizen')}
                    </button>
                </form>

                <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-auth">
                    {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
                </p>

                <p className="admin-login-note">
                    🛡️ Are you an admin? <a href="/admin-login">Login here</a>
                </p>
            </div>
        </div>
    );
}

export default Login;

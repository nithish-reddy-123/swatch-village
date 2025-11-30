import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'user',
        wardNumber: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
            const res = await axios.post(endpoint, formData);

            if (isRegistering) {
                // Auto login after register or just switch to login
                setIsRegistering(false);
                alert('Registration successful! Please login.');
            } else {
                onLogin(res.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="login-container">
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>

                {isRegistering && (
                    <>
                        <div className="form-group">
                            <label>Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        {formData.role === 'user' && (
                            <div className="form-group">
                                <label>Ward Number</label>
                                <input
                                    type="number"
                                    value={formData.wardNumber}
                                    onChange={(e) => setFormData({ ...formData, wardNumber: e.target.value })}
                                    required
                                />
                            </div>
                        )}
                    </>
                )}

                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>
            <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-auth">
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </p>
        </div>
    );
}

export default Login;

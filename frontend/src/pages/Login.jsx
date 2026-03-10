import { useState } from 'react';
import axios from 'axios';
import { useApp } from '../AppContext';

function Login({ onLogin }) {
    const { t } = useApp();
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
                    setError(t('adminsUsePortal'));
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
                <h2>{isRegistering ? `✨ ${t('createCitizenAccount')}` : `👋 ${t('citizenLoginTitle')}`}</h2>
                <p className="login-subtitle">
                    {isRegistering ? t('registerSubtitle') : t('loginSubtitle')}
                </p>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('username')}</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder={t('enterUsername')}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('password')}</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder={t('enterPassword')}
                            required
                        />
                    </div>

                    {isRegistering && (
                        <div className="form-group">
                            <label>{t('wardNumber')}</label>
                            <input
                                type="number"
                                value={formData.wardNumber}
                                onChange={(e) => setFormData({ ...formData, wardNumber: e.target.value })}
                                placeholder={t('enterWardNumber')}
                                required
                            />
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: 8 }}>
                        {isLoading
                            ? (isRegistering ? t('creatingAccount') : t('signingIn'))
                            : (isRegistering ? t('createAccount') : t('signInAsCitizen'))}
                    </button>
                </form>

                <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-auth">
                    {isRegistering ? t('alreadyHaveAccount') : t('dontHaveAccount')}
                </p>

                <p className="admin-login-note">
                    🛡️ {t('areYouAdmin')} <a href="/admin-login">{t('loginHere')}</a>
                </p>
            </div>
        </div>
    );
}

export default Login;

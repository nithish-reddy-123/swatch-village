import { useState } from 'react';
import axios from 'axios';
import { useApp } from '../AppContext';

function AdminLogin({ onLogin }) {
    const { t } = useApp();
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
                setError(t('adminOnlyPortal'));
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
                <h2>{t('adminPortal')}</h2>
                <p className="login-subtitle">{t('adminLoginSubtitle')}</p>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{t('adminUsername')}</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder={t('enterAdminUsername')}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('password')}</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder={t('enterAdminPassword')}
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: 8 }}>
                        {isLoading ? t('authenticating') : `🔐 ${t('signInAsAdmin')}`}
                    </button>
                </form>

                <p className="admin-login-note">
                    👤 {t('areYouCitizen')} <a href="/login">{t('loginHere')}</a>
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '10px',
};

const defaultCenter = {
    lat: 17.3850,
    lng: 78.4867
};

function UserDashboard({ user }) {
    const [problems, setProblems] = useState([]);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProblems();
    }, [user.wardNumber]);

    const fetchProblems = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/problems?wardNumber=${user.wardNumber}`);
            setProblems(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching problems:', err);
            setLoading(false);
        }
    };

    const handleMapClick = (e) => {
        setLocation({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('description', description);
        formData.append('wardNumber', user.wardNumber);
        formData.append('userId', user._id);
        if (image) {
            formData.append('image', image);
        }
        if (location) {
            formData.append('lat', location.lat);
            formData.append('lng', location.lng);
        }

        try {
            await axios.post('http://localhost:5000/api/problems', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setDescription('');
            setImage(null);
            setLocation(null);
            fetchProblems();
            alert('Problem reported successfully!');
        } catch (err) {
            console.error(err);
            alert('Error reporting problem');
        } finally {
            setSubmitting(false);
        }
    };

    const pendingCount = problems.filter(p => p.status === 'pending').length;
    const solvedCount = problems.filter(p => p.status === 'solved').length;

    return (
        <div className="dashboard">
            {/* Stats Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #0f9d84, #0a7363)',
                    color: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 8px 24px rgba(15, 157, 132, 0.25)',
                }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>Total Issues</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 4 }}>{problems.length}</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)',
                }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>Pending</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 4 }}>{pendingCount}</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
                }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>Resolved</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 4 }}>{solvedCount}</div>
                </div>
            </div>

            {/* Report Section */}
            <div className="report-section">
                <h2>📝 Report a Problem — Ward {user.wardNumber}</h2>
                <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue you're facing in your locality..."
                            required
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label>Upload Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>

                    <div className="form-group">
                        <label>📍 Pin Location on Map</label>
                        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={defaultCenter}
                                zoom={12}
                                onClick={handleMapClick}
                            >
                                {location && <Marker position={location} />}
                            </GoogleMap>
                        </LoadScript>
                        {location && (
                            <p style={{ marginTop: 8, fontSize: '0.85rem', color: '#64748b' }}>
                                📌 Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                            </p>
                        )}
                    </div>

                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : '🚀 Submit Report'}
                    </button>
                </form>
            </div>

            {/* Problems List */}
            <div className="problems-list">
                <h2 style={{ marginBottom: 16, paddingBottom: 12, position: 'relative' }}>
                    📋 Issues in Ward {user.wardNumber}
                    <span style={{
                        display: 'inline-block',
                        marginLeft: 12,
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#64748b',
                        background: '#f1f5f9',
                        padding: '2px 12px',
                        borderRadius: '9999px',
                        verticalAlign: 'middle',
                    }}>
                        {problems.length}
                    </span>
                </h2>
                {loading ? (
                    <p style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading issues...</p>
                ) : problems.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        background: '#fff',
                        borderRadius: 16,
                        border: '2px dashed #e2e8f0',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
                        <p style={{ color: '#64748b', fontSize: '1rem' }}>No problems reported in this ward yet!</p>
                    </div>
                ) : (
                    problems.map((problem, index) => (
                        <div
                            key={problem._id}
                            className={`problem-card ${problem.status}`}
                            style={{ animationDelay: `${index * 60}ms`, animation: 'slideIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}
                        >
                            <div className="problem-header">
                                <span className={`status-badge ${problem.status}`}>{problem.status}</span>
                                <span className="date">{new Date(problem.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <p className="description">{problem.description}</p>
                            {problem.imageUrl && (
                                <img
                                    src={`http://localhost:5000${problem.imageUrl}`}
                                    alt="Problem"
                                    className="problem-image"
                                    style={{ maxWidth: '100%', maxHeight: 280, marginTop: 10, borderRadius: 10 }}
                                />
                            )}
                            <p className="reporter">Reported by: {problem.reportedBy?.username || 'Unknown'}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default UserDashboard;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '200px',
    borderRadius: '10px',
};

function AdminDashboard() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all | pending | solved

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/problems');
            setProblems(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching problems:', err);
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/problems/${id}`, { status: newStatus });
            fetchProblems();
        } catch (err) {
            alert('Error updating status');
        }
    };

    const filteredProblems = filter === 'all'
        ? problems
        : problems.filter(p => p.status === filter);

    const pendingCount = problems.filter(p => p.status === 'pending').length;
    const solvedCount = problems.filter(p => p.status === 'solved').length;

    return (
        <div className="dashboard">
            {/* Stats Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
            }}>
                <div
                    onClick={() => setFilter('all')}
                    style={{
                        background: filter === 'all' ? 'linear-gradient(135deg, #0f9d84, #0a7363)' : '#fff',
                        color: filter === 'all' ? '#fff' : '#1e293b',
                        borderRadius: '16px',
                        padding: '24px',
                        cursor: 'pointer',
                        boxShadow: filter === 'all' ? '0 8px 24px rgba(15, 157, 132, 0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
                        border: filter === 'all' ? 'none' : '1px solid #e2e8f0',
                        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    }}
                >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>Total Issues</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 4 }}>{problems.length}</div>
                </div>
                <div
                    onClick={() => setFilter('pending')}
                    style={{
                        background: filter === 'pending' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#fff',
                        color: filter === 'pending' ? '#fff' : '#1e293b',
                        borderRadius: '16px',
                        padding: '24px',
                        cursor: 'pointer',
                        boxShadow: filter === 'pending' ? '0 8px 24px rgba(245, 158, 11, 0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
                        border: filter === 'pending' ? 'none' : '1px solid #e2e8f0',
                        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    }}
                >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>Pending</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 4 }}>{pendingCount}</div>
                </div>
                <div
                    onClick={() => setFilter('solved')}
                    style={{
                        background: filter === 'solved' ? 'linear-gradient(135deg, #10b981, #059669)' : '#fff',
                        color: filter === 'solved' ? '#fff' : '#1e293b',
                        borderRadius: '16px',
                        padding: '24px',
                        cursor: 'pointer',
                        boxShadow: filter === 'solved' ? '0 8px 24px rgba(16, 185, 129, 0.25)' : '0 1px 3px rgba(0,0,0,0.06)',
                        border: filter === 'solved' ? 'none' : '1px solid #e2e8f0',
                        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    }}
                >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>Resolved</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 4 }}>{solvedCount}</div>
                </div>
            </div>

            <h2>🛡️ Admin Dashboard</h2>

            <div className="problems-list">
                {loading ? (
                    <p style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading issues...</p>
                ) : filteredProblems.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        background: '#fff',
                        borderRadius: 16,
                        border: '2px dashed #e2e8f0',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
                        <p style={{ color: '#64748b', fontSize: '1rem' }}>
                            {filter === 'all' ? 'No problems reported yet.' : `No ${filter} issues.`}
                        </p>
                    </div>
                ) : (
                    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                        {filteredProblems.map((problem, index) => (
                            <div
                                key={problem._id}
                                className={`problem-card ${problem.status}`}
                                style={{ animationDelay: `${index * 60}ms`, animation: 'slideIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}
                            >
                                <div className="problem-header">
                                    <span className={`status-badge ${problem.status}`}>{problem.status}</span>
                                    <span className="ward-badge">Ward {problem.wardNumber}</span>
                                    <span className="date">{new Date(problem.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <p className="description">{problem.description}</p>

                                {problem.imageUrl && (
                                    <img
                                        src={`http://localhost:5000${problem.imageUrl}`}
                                        alt="Problem"
                                        className="problem-image"
                                        style={{ maxWidth: 280, marginTop: 10, borderRadius: 10 }}
                                    />
                                )}

                                {problem.location && problem.location.lat && (
                                    <div className="map-preview" style={{ marginTop: 12 }}>
                                        <GoogleMap
                                            mapContainerStyle={containerStyle}
                                            center={problem.location}
                                            zoom={14}
                                        >
                                            <Marker position={problem.location} />
                                        </GoogleMap>
                                    </div>
                                )}

                                <p className="reporter">Reported by: {problem.reportedBy?.username || 'Unknown'}</p>

                                {problem.status === 'pending' && (
                                    <button
                                        onClick={() => updateStatus(problem._id, 'solved')}
                                        className="solve-btn"
                                    >
                                        ✅ Mark as Resolved
                                    </button>
                                )}
                            </div>
                        ))}
                    </LoadScript>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;

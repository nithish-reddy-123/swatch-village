import { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '200px'
};

function AdminDashboard() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const res = await axios.get('/api/problems');
            setProblems(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching problems:', err);
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(`/api/problems/${id}`, { status: newStatus });
            fetchProblems(); // Refresh list
        } catch (err) {
            alert('Error updating status');
        }
    };

    return (
        <div className="dashboard">
            <h2>Admin Dashboard - All Problems</h2>

            <div className="problems-list">
                {loading ? (
                    <p>Loading...</p>
                ) : problems.length === 0 ? (
                    <p>No problems reported.</p>
                ) : (
                    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                        {problems.map(problem => (
                            <div key={problem._id} className={`problem-card ${problem.status}`}>
                                <div className="problem-header">
                                    <span className={`status-badge ${problem.status}`}>{problem.status}</span>
                                    <span className="ward-badge">Ward {problem.wardNumber}</span>
                                    <span className="date">{new Date(problem.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="description">{problem.description}</p>

                                {problem.imageUrl && (
                                    <img src={`http://localhost:5000${problem.imageUrl}`} alt="Problem" className="problem-image" style={{ maxWidth: '200px', marginTop: '10px' }} />
                                )}

                                {problem.location && problem.location.lat && (
                                    <div className="map-preview" style={{ marginTop: '10px' }}>
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
                                        style={{ marginTop: '10px' }}
                                    >
                                        Mark as Solved
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

import { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '300px'
};

const defaultCenter = {
    lat: 17.3850, // Hyderabad coordinates as default
    lng: 78.4867
};

function UserDashboard({ user }) {
    const [problems, setProblems] = useState([]);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProblems();
    }, [user.wardNumber]);

    const fetchProblems = async () => {
        try {
            const res = await axios.get(`/api/problems?wardNumber=${user.wardNumber}`);
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
            await axios.post('/api/problems', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setDescription('');
            setImage(null);
            setLocation(null);
            fetchProblems(); // Refresh list
            alert('Problem reported successfully!');
        } catch (err) {
            console.error(err);
            alert('Error reporting problem');
        }
    };

    return (
        <div className="dashboard">
            <div className="report-section">
                <h2>Report a Problem (Ward {user.wardNumber})</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the problem..."
                            required
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label>Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>

                    <div className="form-group">
                        <label>Select Location (Click on map)</label>
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
                        {location && <p>Location selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>}
                    </div>

                    <button type="submit">Report Problem</button>
                </form>
            </div>

            <div className="problems-list">
                <h2>Problems in Ward {user.wardNumber}</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : problems.length === 0 ? (
                    <p>No problems reported in this ward.</p>
                ) : (
                    problems.map(problem => (
                        <div key={problem._id} className={`problem-card ${problem.status}`}>
                            <div className="problem-header">
                                <span className={`status-badge ${problem.status}`}>{problem.status}</span>
                                <span className="date">{new Date(problem.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="description">{problem.description}</p>
                            {problem.imageUrl && (
                                <img src={`https://swatch-village.onrender.com${problem.imageUrl}`} alt="Problem" className="problem-image" style={{ maxWidth: '100%', marginTop: '10px' }} />
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

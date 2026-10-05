import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLocations } from "../../utils/api";
import WildlifeMap from "../../components/WildlifeMap";
import "./Location.css";
import "../../App.css";

function Locations() {
    const [locations, setLocations] = useState([]);
    const [state, setState] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        const loadLocations = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getLocations(state);

                setLocations(data);
            } catch (err) {
                setError(err.message || "Failed to fetch locations.");
            } finally {
                setLoading(false);
            }
        };

        loadLocations();
    }, [state]);
    const handleState = (event) => {
        setState(event.target.value);
    };

    const navigate = useNavigate();

    if (loading) {
        return <div className="page loading-state">Loading locations...</div>;
    }

    if (error) {
        return (
            <div className="page error-state">
                <div className="error-message">⚠️ Error:{error}</div>
            </div>
        );
    }

    const truncateText = (text, maxLength = 100) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className="page pageee">
            <div className="headerrrr">
                <div>
                    <h1> Locations</h1>

                    <p className="subtitle">Explore wildlife observation locations across Malaysia.</p>
                </div>

                {isAdmin && (
                    <button className="add-button" onClick={() => navigate("/locations/new")}>
                        + Add Location
                    </button>
                )}
            </div>
            <div className="locations-controls">
                <select value={state} onChange={handleState} className="category-select">
                    <option value="All">All States</option>
                    <option value="Johor">Johor</option>
                    <option value="Kedah">Kedah</option>
                    <option value="Kelantan">Kelantan</option>
                    <option value="Malacca">Malacca</option>
                    <option value="Negeri Sembilan">Negeri Sembilan</option>
                    <option value="Pahang">Pahang</option>
                    <option value="Penang">Penang</option>
                    <option value="Perak">Perak</option>
                    <option value="Perlis">Perlis</option>
                    <option value="Sabah">Sabah</option>
                    <option value="Sarawak">Sarawak</option>
                    <option value="Selangor">Selangor</option>
                    <option value="Terengganu">Terengganu</option>
                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                </select>
            </div>
            {/* Map */}
            <div className="locations-map-container">
                <WildlifeMap locations={locations} />
            </div>

            <p className="countttt">{locations.length} locations found</p>

            {/* Location List */}
            <div className="gridd">
                {locations.length > 0 ? (
                    locations.map((location) => (
                        <div className="carddd" key={location._id}>
                            <div className="contenttt">
                                <h2>{location.name}</h2>

                                <p className="location-state">
                                    <strong>State:</strong> {location.state}
                                </p>

                                <p className="location-description">{truncateText(location.description)}</p>

                                <p className="location-coordinate">
                                    <strong>Coordinates:</strong> {location.latitude}, {location.longitude}
                                </p>

                                <div className="footerr">
                                    <Link to={`/locations/${location._id}`} className="view-button">
                                        View Details →
                                    </Link>

                                    {isAdmin && (
                                        <div className="admin-buttons">
                                            <button className="edit-button" onClick={() => navigate(`/locations/edit/${location._id}`)}>
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No locations found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Locations;

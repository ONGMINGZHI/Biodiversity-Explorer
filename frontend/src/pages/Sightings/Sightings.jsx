import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSightings } from "../../utils/api";
import "./Sightings.css";
import "../../App.css";

function Sightings() {
    const navigate = useNavigate();
    const truncateText = (text, maxLength = 100) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const [sightings, setSightings] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        loadSightings();
    }, []);

    const loadSightings = async (searchTerm = "") => {
        try {
            setLoading(true);
            setError("");

            const data = await getSightings(searchTerm);

            setSightings(Array.isArray(data) ? data : data.sightings || []);
        } catch (err) {
            setError(err.message || "Failed to fetch sightings.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        loadSightings(search);
    };

    if (loading) {
        return <div className="page loading-state">Loading sightings...</div>;
    }

    if (error) {
        return (
            <div className="page error-state">
                <p className="error-message">⚠️ Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="page pageee">
            <div className="headerrrr">
                <div>
                    <h1>Sightings</h1>

                    <p className="subtitle">Explore wildlife observations recorded across Malaysia.</p>
                </div>

                {isAdmin && (
                    <button className="add-button" onClick={() => navigate("/sightings/new")}>
                        + Add Sighting
                    </button>
                )}
            </div>

            <form className="sightings-controls" onSubmit={handleSubmit}>
                <input type="text" placeholder="Search by species..." value={search} onChange={handleSearch} className="search-input" />

                <button type="submit" className="search-button">
                    Search
                </button>
            </form>

            <p className="countttt">{sightings.length} sightings found</p>
            <div className="gridd">
                {sightings.length > 0 ? (
                    sightings.map((sighting) => (
                        <div className="carddd" key={sighting._id}>
                            {sighting.imageUrl ? (
                                <div className="sighting-image-wrapper">
                                    <img src={sighting.imageUrl} alt={sighting.species?.name || "Wildlife sighting"} className="sighting-image" />
                                </div>
                            ) : (
                                <div className="sighting-image-placeholder">🐾</div>
                            )}

                            <div className="contenttt">
                                <h2>{sighting.species?.name || "Unknown Species"}</h2>

                                {sighting.species?.scientificName && <p className="sighting-scientific-name">{sighting.species.scientificName}</p>}

                                <div className="sighting-info">
                                    <p>
                                        <strong>Location</strong>
                                        <br />
                                        {sighting.location?.name || "Unknown Location"}
                                    </p>

                                    {sighting.location?.state && (
                                        <p>
                                            <strong>State</strong>
                                            <br />
                                            {sighting.location.state}
                                        </p>
                                    )}

                                    <p>
                                        <strong>Date</strong>
                                        <br />
                                        {new Date(sighting.date).toLocaleDateString()}
                                    </p>

                                    <p>
                                        <strong>Observed</strong>
                                        <br />
                                        {sighting.numberObserved}
                                    </p>
                                </div>

                                {sighting.location && (
                                    <p className="sighting-location-details">
                                        <strong>Coordinates:</strong> {sighting.location.latitude}, {sighting.location.longitude}
                                    </p>
                                )}

                                {sighting.notes && (
                                    <p className="sighting-notes">
                                        <strong>Notes:</strong> {truncateText(sighting.notes, 120)}
                                    </p>
                                )}

                                <div className="footerr">
                                    <Link to={`/sightings/${sighting._id}`} className="view-button">
                                        View Details
                                    </Link>

                                    {isAdmin && (
                                        <div className="admin-buttons">
                                            <button className="edit-button" onClick={() => navigate(`/sightings/edit/${sighting._id}`)}>
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
                        <p>No sightings found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Sightings;

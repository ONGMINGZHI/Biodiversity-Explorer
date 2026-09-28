import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSightings, getSpecies, getLocations } from "../../utils/api";
import "./Sightings.css";

function Sightings() {
    const navigate = useNavigate();

    const [sightings, setSightings] = useState([]);
    const [species, setSpecies] = useState([]);
    const [locations, setLocations] = useState([]);

    const [search, setSearch] = useState("");
    const [selectedSpecies, setSelectedSpecies] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [date, setDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));

                setIsAdmin(payload.role === "admin");
            } catch {
                setIsAdmin(false);
            }
        }
    }, []);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [speciesData, locationsData] = await Promise.all([getSpecies(), getLocations()]);

                setSpecies(Array.isArray(speciesData) ? speciesData : speciesData.species || []);

                setLocations(Array.isArray(locationsData) ? locationsData : locationsData.locations || []);
            } catch (error) {
                setError(error.message);
            }
        };

        loadOptions();
    }, []);

    useEffect(() => {
        const loadSightings = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getSightings(search, selectedSpecies, selectedLocation, date);

                setSightings(Array.isArray(data) ? data : data.sightings || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(loadSightings, 300);

        return () => clearTimeout(timer);
    }, [search, selectedSpecies, selectedLocation, date]);

    const clearFilters = () => {
        setSearch("");
        setSelectedSpecies("");
        setSelectedLocation("");
        setDate("");
    };

    if (loading) {
        return (
            <div className="page loading-state">
                <p>Loading sightings...</p>
            </div>
        );
    }

    return (
        <div className="page sightings-page">
            <div className="sightings-header">
                <div>
                    <h1>Sightings</h1>

                    <p className="sightings-subtitle">Explore wildlife observations recorded across Malaysia.</p>
                </div>

                {isAdmin && (
                    <button className="add-button" onClick={() => navigate("/sightings/new")}>
                        + Add Sighting
                    </button>
                )}
            </div>

            <div className="sightings-controls">
                <input type="text" className="search-input" placeholder="Search species..." value={search} onChange={(event) => setSearch(event.target.value)} />

                <select value={selectedSpecies} onChange={(event) => setSelectedSpecies(event.target.value)}>
                    <option value="">All Species</option>

                    {species.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <select value={selectedLocation} onChange={(event) => setSelectedLocation(event.target.value)}>
                    <option value="">All Locations</option>

                    {locations.map((location) => (
                        <option key={location._id} value={location._id}>
                            {location.name}
                        </option>
                    ))}
                </select>

                <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />

                <button className="clear-filter-button" onClick={clearFilters}>
                    Clear
                </button>
            </div>

            {error && <p className="error-message">⚠️ {error}</p>}

            <p className="sightings-count">
                {sightings.length} sighting
                {sightings.length !== 1 ? "s" : ""} found
            </p>

            {sightings.length === 0 ? (
                <div className="no-sightings">
                    <h2>No sightings found</h2>
                    <p>Try changing your search or filters.</p>
                </div>
            ) : (
                <div className="sightings-grid">
                    {sightings.map((sighting) => (
                        <div className="sighting-card" key={sighting._id}>
                            {sighting.imageUrl ? (
                                <div className="sighting-image-wrapper">
                                    <img src={sighting.imageUrl} alt={sighting.species?.name || "Wildlife sighting"} className="sighting-image" />
                                </div>
                            ) : (
                                <div className="sighting-image-placeholder">🐾</div>
                            )}

                            <div className="sighting-content">
                                <h2>{sighting.species?.name || "Unknown Species"}</h2>

                                {sighting.species?.scientificName && <p className="sighting-scientific-name">{sighting.species.scientificName}</p>}

                                <div className="sighting-info">
                                    <p>
                                        <strong>Location</strong>
                                        <br />
                                        {sighting.location?.name || "Unknown Location"}
                                    </p>

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

                                {sighting.notes && <p className="sighting-notes">{sighting.notes}</p>}

                                <Link to={`/sightings/${sighting._id}`} className="view-button">
                                    View Details
                                </Link>

                                {isAdmin && (
                                    <button className="edit-button" onClick={() => navigate(`/sightings/edit/${sighting._id}`)}>
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Sightings;

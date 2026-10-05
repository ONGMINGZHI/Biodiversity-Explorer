import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLocationById } from "../../utils/api";
import "./Location.css";

function LocationDetail() {
    const { id } = useParams();

    const [locations, setLocations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadLocations = async () => {
            try {
                const data = await getLocationById(id);
                setLocations(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadLocations();
    }, [id]);

    if (loading) {
        return (
            <div className="page loading-state">
                <p>Loading locations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page error-state">
                <p className="error-message">⚠️ {error}</p>
            </div>
        );
    }

    if (!locations) {
        return (
            <div className="page">
                <p>Location not found.</p>
            </div>
        );
    }

    return (
        <div className="page detail-page">
            {/* Back button */}
            <Link to="/locations" className="back-link">
                ← Back to Locations
            </Link>

            {/* Main information */}
            <div className="detail-hero">
                {/* Title */}
                <div className="detail-header">
                    <h1>{locations.name}</h1>
                </div>
            </div>

            <section className="detail-section">
                <h2>State</h2>

                <div className="detail-card">
                    <p>{locations.state}</p>
                </div>
            </section>

            {/* Description */}
            <section className="detail-section">
                <h2>Description</h2>

                <div className="detail-card">
                    <p>{locations.description || "No description available."}</p>
                </div>
            </section>

            <section className="detail-section">
                <h2>Coordinates</h2>

                <div className="detail-card">
                    <p>{locations.latitude}</p>
                </div>

                <div className="detail-card">
                    <p>{locations.longitude}</p>
                </div>
            </section>
        </div>
    );
}

export default LocationDetail;

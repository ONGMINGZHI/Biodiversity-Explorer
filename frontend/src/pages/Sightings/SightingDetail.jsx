import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSightingById } from "../../utils/api";
import "./Sightings.css";
import "../../App.css";

function SightingDetail() {
    const { id } = useParams();

    const [sighting, setSighting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSighting = async () => {
            try {
                const data = await getSightingById(id);
                setSighting(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadSighting();
    }, [id]);

    if (loading) {
        return (
            <div className="page loading-state">
                <p>Loading sighting...</p>
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

    if (!sighting) {
        return (
            <div className="page">
                <p>Sighting not found.</p>
            </div>
        );
    }

    return (
        <div className="page detail-page">
            <Link to="/sightings" className="back-link">
                ← Back to Sightings
            </Link>

            <div className="detail-hero">
                {sighting.imageUrl && (
                    <div className="detail-image">
                        <img
                            src={sighting.imageUrl || "/images/image-coming-soon.png"}
                            alt={sighting.name}
                            onError={(e) => {
                                e.currentTarget.src = "/images/image-coming-soon.png";
                            }}
                        />
                    </div>
                )}

                <div className="detail-header">
                    <h1>
                        {sighting.species?.name || "Unknown Species"}
                    </h1>

                    {sighting.species?.scientificName && (
                        <p className="detail-subtitle">
                            {sighting.species.scientificName}
                        </p>
                    )}
                </div>
            </div>

            <div className="detail-content">
                <section className="detail-section">
                    <h2>Observation Details</h2>

                    <div className="taxonomy-grid">
                        <div className="taxonomy-item">
                            <span className="taxonomy-rank">Location</span>
                            <span className="taxonomy-value">
                                {sighting.location?.name || "Unknown Location"}
                            </span>
                        </div>

                        <div className="taxonomy-item">
                            <span className="taxonomy-rank">State</span>
                            <span className="taxonomy-value">
                                {sighting.location?.state || "Unknown"}
                            </span>
                        </div>

                        <div className="taxonomy-item">
                            <span className="taxonomy-rank">Date</span>
                            <span className="taxonomy-value">
                                {new Date(sighting.date).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="taxonomy-item">
                            <span className="taxonomy-rank">Number Observed</span>
                            <span className="taxonomy-value">
                                {sighting.numberObserved}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="detail-section">
                    <h2>Observation Location</h2>

                    <div className="detail-card">
                        <h3>
                            {sighting.location?.name || "Unknown Location"}
                        </h3>

                        {sighting.location?.state && (
                            <p>
                                <strong>State:</strong>{" "}
                                {sighting.location.state}
                            </p>
                        )}

                        {sighting.location?.description && (
                            <p>{sighting.location.description}</p>
                        )}

                        {sighting.location && (
                            <p>
                                <strong>Coordinates:</strong>{" "}
                                {sighting.location.latitude},{" "}
                                {sighting.location.longitude}
                            </p>
                        )}
                    </div>
                </section>

                <section className="detail-section">
                    <h2>Observation Notes</h2>

                    <div className="detail-card">
                        {sighting.notes ? (
                            <p>{sighting.notes}</p>
                        ) : (
                            <p>No observation notes were provided.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default SightingDetail;
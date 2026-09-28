import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSightingById } from "../../utils/api";
import "./Sightings.css";

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
            <div className="page">
                <p className="error-message">
                    ⚠️ {error}
                </p>
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
        <div className="page sighting-detail-page">

            <Link
                to="/sightings"
                className="back-link"
            >
                ← Back to Sightings
            </Link>

            <div className="sighting-detail">

                {/* Image */}
                <div className="sighting-detail-image">
                    {sighting.imageUrl ? (
                        <img
                            src={sighting.imageUrl}
                            alt={
                                sighting.species?.name ||
                                "Wildlife sighting"
                            }
                        />
                    ) : (
                        <div className="detail-image-placeholder">
                            🐾
                        </div>
                    )}
                </div>

                {/* Main Information */}
                <div className="sighting-detail-info">

                    <h1>
                        {sighting.species?.name ||
                            "Unknown Species"}
                    </h1>

                    {sighting.species?.scientificName && (
                        <p className="scientific-name">
                            {sighting.species.scientificName}
                        </p>
                    )}

                    <div className="detail-info-list">

                        <p>
                            <strong>Location</strong>
                            <span>
                                {sighting.location?.name ||
                                    "Unknown Location"}
                            </span>
                        </p>

                        <p>
                            <strong>Date Observed</strong>
                            <span>
                                {new Date(
                                    sighting.date
                                ).toLocaleDateString()}
                            </span>
                        </p>

                        <p>
                            <strong>Number Observed</strong>
                            <span>
                                {sighting.numberObserved}
                            </span>
                        </p>

                    </div>

                </div>
            </div>

            {/* Location */}
            <section className="detail-section">

                <h2>Observation Location</h2>

                <div className="detail-card">

                    <h3>
                        {sighting.location?.name ||
                            "Unknown Location"}
                    </h3>

                    {sighting.location?.state && (
                        <p>
                            <strong>State:</strong>{" "}
                            {sighting.location.state}
                        </p>
                    )}

                    {sighting.location?.description && (
                        <p>
                            {sighting.location.description}
                        </p>
                    )}

                </div>

            </section>

            {/* Notes */}
            <section className="detail-section">

                <h2>Observation Notes</h2>

                <div className="detail-card">

                    {sighting.notes ? (
                        <p>{sighting.notes}</p>
                    ) : (
                        <p>
                            No observation notes were
                            provided.
                        </p>
                    )}

                </div>

            </section>

        </div>
    );
}

export default SightingDetail;
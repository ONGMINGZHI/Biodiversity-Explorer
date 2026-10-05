import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSpeciesById } from "../../utils/api";
import "./Species.css";
import "../../App.css";

function SpeciesDetail() {
    const { id } = useParams();

    const [species, setSpecies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSpecies = async () => {
            try {
                const data = await getSpeciesById(id);
                setSpecies(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadSpecies();
    }, [id]);

    if (loading) {
        return (
            <div className="page loading-state">
                <p>Loading species...</p>
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

    if (!species) {
        return (
            <div className="page">
                <p>Species not found.</p>
            </div>
        );
    }

    return (
        <div className="page detail-page">
            {/* Back button */}
            <Link to="/species" className="back-link">
                ← Back to Species
            </Link>

            {/* Main information */}
            <div className="detail-hero">
                {/* Image */}
                {species.imageUrl && (
                    <div className="detail-image">
                        <img
                            src={species.imageUrl || "/images/image-coming-soon.png"}
                            alt={species.name}
                            onError={(e) => {
                                e.currentTarget.src = "/images/image-coming-soon.png";
                            }}
                        />
                    </div>
                )}

                {/* Title */}
                <div className="detail-header">
                    <h1>{species.name}</h1>

                    {species.scientificName && <p className="detail-subtitle">{species.scientificName}</p>}
                </div>
            </div>

            {/* Page content */}
            <div className="detail-content">
                <section className="detail-section">
                    <h2>Taxonomy</h2>

                    <div className="taxonomy-grid">
                        <div className="taxonomy-item">
                            <span className="taxonomy-rank">Kingdom</span>
                            <span className="taxonomy-value">{species.kingdom}</span>
                        </div>

                        <div className="taxonomy-item">
                            <span className="taxonomy-rank">Phylum</span>
                            <span className="taxonomy-value">{species.phylum}</span>
                        </div>

                        <div className="taxonomy-item">
                            <span className="taxonomy-rank">Class</span>
                            <span className="taxonomy-value">{species.className}</span>
                        </div>

                        <div className="taxonomy-item">
                            <span className="taxonomy-rank">Order</span>
                            <span className="taxonomy-value">{species.order}</span>
                        </div>

                        <div className="taxonomy-item">
                            <span className="taxonomy-rank">Family</span>
                            <span className="taxonomy-value">{species.family}</span>
                        </div>

                        <div className="taxonomy-item">
                            <span className="taxonomy-rank">Genus</span>
                            <span className="taxonomy-value">{species.genus}</span>
                        </div>
                    </div>
                </section>

                {/* Region */}
                <section className="detail-section">
                    <h2>Region</h2>

                    <div className="detail-card">
                        <p>{species.region}</p>
                    </div>
                </section>

                {/* Description */}
                <section className="detail-section">
                    <h2>Description</h2>

                    <div className="detail-card">
                        <p>{species.description || "No description available."}</p>
                    </div>
                </section>

                {/* Habitat */}
                <section className="detail-section">
                    <h2>Habitat</h2>

                    {species.habitat ? (
                        <div className="detail-card">
                            <h3>{species.habitat.name}</h3>

                            {species.habitat.description && <p>{species.habitat.description}</p>}

                            {species.habitat.region && (
                                <p>
                                    <strong>Region:</strong> {species.habitat.region}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="detail-card">
                            <p>No habitat information available.</p>
                        </div>
                    )}
                </section>

                {/* Conservation Status */}
                <section className="detail-section">
                    <h2>Conservation Status</h2>

                    {species.conservationStatus ? (
                        <div className="detail-card">
                            <h3>{species.conservationStatus.name}</h3>

                            {species.conservationStatus.description && <p>{species.conservationStatus.description}</p>}
                        </div>
                    ) : (
                        <div className="detail-card">
                            <p>No conservation status information available.</p>
                        </div>
                    )}
                </section>

                {/* Interesting Facts */}
                <section className="detail-section">
                    <h2>Interesting Facts</h2>

                    {species.interestingFacts && species.interestingFacts.length > 0 ? (
                        <div className="detail-card">
                            <ul className="facts-list">
                                {species.interestingFacts.map((fact, index) => (
                                    <li key={index}>{fact}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="detail-card">
                            <p>No interesting facts available.</p>
                        </div>
                    )}
                </section>

                {/* Image Information */}
                {(species.imageCredit || species.imageSource || species.imageLicense) && (
                    <section className="detail-section">
                        <h2>Image Information</h2>

                        <div className="detail-card">
                            {species.imageCredit && (
                                <p>
                                    <strong>Credit:</strong> {species.imageCredit}
                                </p>
                            )}

                            {species.imageSource && (
                                <p>
                                    <strong>Source:</strong>{" "}
                                    <a href={species.imageSource} target="_blank" rel="noopener noreferrer">
                                        View Source
                                    </a>
                                </p>
                            )}

                            {species.imageLicense && (
                                <p>
                                    <strong>License:</strong> {species.imageLicense}
                                </p>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export default SpeciesDetail;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpeciesById } from "../../utils/api";
import DetailPage from "../../components/DetailPage";
import "./Species.css"


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
                <p className="error-message">
                    ⚠️ {error}
                </p>
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
        <DetailPage
            backLink="/species"
            backText="Back to Species"
            title={species.name}
            subtitle={species.scientificName}
            image={species.imageUrl}
            imageAlt={species.name}
        >

            {/* Basic Information */}
            <section className="detail-section">
                <h2>Basic Information</h2>

                <div className="detail-info-grid">

                    <div className="detail-info-item">
                        <strong>Category</strong>
                        <span>{species.category}</span>
                    </div>

                    <div className="detail-info-item">
                        <strong>Region</strong>
                        <span>{species.region}</span>
                    </div>

                </div>
            </section>

            {/* Description */}
            <section className="detail-section">
                <h2>Description</h2>

                <div className="detail-card">
                    <p>{species.description}</p>
                </div>
            </section>

            {/* Habitat */}
            <section className="detail-section">
                <h2>Habitat</h2>

                {species.habitat ? (
                    <div className="detail-card">
                        <h3>{species.habitat.name}</h3>

                        <p>
                            {species.habitat.description}
                        </p>
                    </div>
                ) : (
                    <p>No habitat information available.</p>
                )}
            </section>

            {/* Conservation Status */}
            <section className="detail-section">
                <h2>Conservation Status</h2>

                {species.conservationStatus ? (
                    <div className="detail-card">
                        <h3>
                            {species.conservationStatus.name}
                        </h3>

                        <p>
                            {species.conservationStatus.description}
                        </p>
                    </div>
                ) : (
                    <p>
                        No conservation status information
                        available.
                    </p>
                )}
            </section>

            {/* Interesting Facts */}
            <section className="detail-section">
                <h2>Interesting Facts</h2>

                {species.interestingFacts &&
                species.interestingFacts.length > 0 ? (
                    <div className="detail-card">
                        <ul className="facts-list">
                            {species.interestingFacts.map(
                                (fact, index) => (
                                    <li key={index}>
                                        {fact}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                ) : (
                    <p>
                        No interesting facts available.
                    </p>
                )}
            </section>

            {/* Image Information */}
            {(species.imageCredit ||
                species.imageSource ||
                species.imageLicense) && (
                <section className="detail-section">
                    <h2>Image Information</h2>

                    <div className="detail-card">

                        {species.imageCredit && (
                            <p>
                                <strong>Credit:</strong>{" "}
                                {species.imageCredit}
                            </p>
                        )}

                        {species.imageSource && (
                            <p>
                                <strong>Source:</strong>{" "}
                                <a
                                    href={species.imageSource}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Source
                                </a>
                            </p>
                        )}

                        {species.imageLicense && (
                            <p>
                                <strong>License:</strong>{" "}
                                {species.imageLicense}
                            </p>
                        )}

                    </div>
                </section>
            )}

        </DetailPage>
    );
}

export default SpeciesDetail;
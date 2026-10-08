import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getConservationProjectById } from "../../utils/api";
import "./ConservationProject.css";
import "../../App.css";

function ConservationProjectDetail() {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);

                const data = await getConservationProjectById(id);

                setProject(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [id]);

    if (loading) {
        return (
            <div className="page loading-state">
                <p>Loading conservation project...</p>
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

    if (!project) {
        return (
            <div className="page">
                <p>Conservation project not found.</p>
            </div>
        );
    }

    return (
        <div className="page detail-page conservation-project-detail-page">
            <Link to="/conservation-projects" className="back-link">
                ← Back to Conservation Projects
            </Link>

            <div className={`detail-hero ${!project.imageUrl ? "no-project-image" : ""}`}>
                {project.imageUrl && (
                    <div className="detail-image">
                        <img
                            src={project.imageUrl}
                            alt={project.name}
                            onError={(event) => {
                                event.currentTarget.parentElement.style.display = "none";
                            }}
                        />
                    </div>
                )}

                <div className="detail-header">
                    <h1>{project.name}</h1>

                    <p className="project-status-badge">{project.status}</p>

                    <div className="detail-info-item">
                        <strong>Organisation:</strong>
                        <p>{project.organisation || "Organisation not specified"}</p>
                    </div>
                </div>
            </div>

            <div className="detail-content">
                <section className="detail-section">
                    <h2>About This Project</h2>

                    <div className="detail-info-grid">
                        <div className="detail-des">
                            <strong>Description</strong>
                            <p>{project.description || "No description available."}</p>
                        </div>
                        <div className="detail-info-item">
                            <strong>Start Date</strong>
                            <p>{project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not specified"}</p>
                        </div>

                        <div className="detail-info-item">
                            <strong>End Date</strong>
                            <p>{project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not specified"}</p>
                        </div>
                    </div>
                </section>

                <section className="detail-section">
                    <h2>Species Involved</h2>

                    {project.species && project.species.length > 0 ? (
                        <div className="project-species-list">
                            {project.species.map((species) => (
                                <Link to={`/species/${species._id}`} className="detail-card species-detail-card" key={species._id}>
                                    <h3>{species.name}</h3>

                                    {species.scientificName && <p className="scientific-name">{species.scientificName}</p>}

                                    <span className="species-view-link">View Species Details →</span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>No species have been associated with this project.</p>
                    )}
                </section>

                {project.projectUrl && (
                    <section className="detail-section">
                        <h2>Official Project Website</h2>

                        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="project-link-button">
                            Visit Official Project Website ↗
                        </a>
                    </section>
                )}
            </div>
        </div>
    );
}

export default ConservationProjectDetail;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getConservationProjectById } from "../../utils/api";
import "./ConservationProject.css";

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
        <div className="page conservation-project-detail-page">
            {/* Back */}
            <Link to="/conservation-projects" className="back-link">
                ← Back to Conservation Projects
            </Link>

            {/* Main information */}
            <div className="conservation-project-detail">
                {/* Image */}
                <div className="conservation-project-detail-image">{project.imageUrl ? <img src={project.imageUrl} alt={project.name} /> : <div className="detail-image-placeholder">🌱</div>}</div>

                {/* Information */}
                <div className="conservation-project-detail-info">
                    <h1>{project.name}</h1>

                    <p className="project-status-badge">{project.status}</p>

                    <p>
                        <strong>Organisation:</strong> {project.organisation || "Not specified"}
                    </p>

                    <p>
                        <strong>Description:</strong>
                    </p>

                    <p>{project.description || "No description available."}</p>

                    <div className="project-dates">
                        <p>
                            <strong>Start Date:</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not specified"}
                        </p>

                        <p>
                            <strong>End Date:</strong> {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not specified"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Species */}
            <section className="detail-section">
                <h2>Species Involved</h2>

                {project.species && project.species.length > 0 ? (
                    <div className="project-species-list">
                        {project.species.map((species) => (
                            <div className="detail-card" key={species._id}>
                                <h3>{species.name}</h3>

                                {species.scientificName && <p className="scientific-name">{species.scientificName}</p>}

                                {species.category && (
                                    <p>
                                        <strong>Category:</strong> {species.category}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No species have been associated with this project.</p>
                )}
            </section>
            {project.projectUrl && (
                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="project-link-button">
                    Visit Official Project Website ↗
                </a>
            )}
        </div>
    );
}

export default ConservationProjectDetail;

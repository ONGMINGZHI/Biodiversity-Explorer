import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getConservationProjects } from "../../utils/api";
import "./ConservationProject.css";


function ConservationProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const navigate = useNavigate();

    // Check admin
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getConservationProjects(search, status);

                setProjects(data);
            } catch (err) {
                setError(err.message || "Failed to fetch conservation projects.");
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, [search, status]);

    if (loading) {
        return (
            <div className="page loading-state">
                <p>Loading conservation projects...</p>
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

    return (
        <div className="page conservation-projects-page">
            {/* Header */}
            <div className="conservation-projects-header">
                <div>
                    <h1>Conservation Projects</h1>

                    <p className="conservation-projects-subtitle">Explore conservation projects protecting Malaysia's biodiversity.</p>
                </div>

                {isAdmin && (
                    <button className="add-button" onClick={() => navigate("/conservation-projects/new")}>
                        + Add Conservation Project
                    </button>
                )}
            </div>

            {/* Search and Filter */}
            <div className="conservation-projects-controls">
                <input type="text" placeholder="Search conservation projects..." value={search} onChange={(event) => setSearch(event.target.value)} className="search-input" />

                <select value={status} onChange={(event) => setStatus(event.target.value)} className="category-select">
                    <option value="All">All Statuses</option>

                    <option value="Planned">Planned</option>

                    <option value="Ongoing">Ongoing</option>

                    <option value="Completed">Completed</option>
                </select>
            </div>

            {/* Count */}
            <p className="conservation-projects-count">
                {projects.length} project
                {projects.length !== 1 ? "s" : ""} found
            </p>

            {/* Projects */}
            {projects.length === 0 ? (
                <div className="no-results">
                    <h2>No conservation projects found</h2>

                    <p>No projects match your search or filter.</p>
                </div>
            ) : (
                <div className="conservation-projects-grid">
                    {projects.map((project) => (
                        <div className="conservation-project-card" key={project._id}>
                            {/* Image */}
                            {project.imageUrl ? (
                                <div className="card-image-wrapper">
                                    <img
                                        src={project.imageUrl}
                                        alt={project.name}
                                        className="conservation-project-card-image"
                                        onError={(event) => {
                                            event.currentTarget.style.display = "none";
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="card-image-placeholder">🌱</div>
                            )}

                            {/* Content */}
                            <div className="card-content">
                                <h2>{project.name}</h2>

                                <p className="project-organisation">
                                    <strong>Organisation:</strong> {project.organisation || "Not specified"}
                                </p>

                                <p className="project-description">{project.description}</p>

                                <p className="project-status">
                                    <strong>Status:</strong> {project.status}
                                </p>

                                <div className="card-footer">
                                    <Link to={`/conservation-projects/${project._id}`} className="view-button">
                                        View Details →
                                    </Link>

                                    {isAdmin && (
                                        <div className="admin-buttons">
                                            <button className="edit-button" onClick={() => navigate(`/conservation-projects/edit/${project._id}`)}>
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ConservationProjects;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getConservationProjectById,updateConservationProject, deleteConservationProject } from "../../utils/api";
import "./ConservationProject.css";
import ConservationProjectForm from "../../components/ConservationProjectForm";

function EditConservationProject() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProject = async () => {
            try {
                const data = await getConservationProjectById(id);
                setProject(data);
            } catch (error) {
                setError(error.message || "Failed to load projects.");
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [id]);

    const handleSubmit = async (data) => {
        await updateConservationProject(id, data);
        navigate(`/conservation-projects/${id}`);
    };

    const handleDelete = async () => {
        await deleteConservationProject(id);
        navigate("/conservation-projects");
    };
    const handleCancel = () => {
        navigate(`/conservation-projects/${id}`);
    };

    if (loading) {
        return (
            <div className="page loading-state">
                <p>Loading projects...</p>
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
            <div className="page error-state">
                <p className="error-message">Project not found.</p>
            </div>
        );
    }

    return <ConservationProjectForm initialData={project} onSubmit={handleSubmit} onDelete={handleDelete} onCancel={handleCancel} editMode={true} />;
}

export default EditConservationProject;

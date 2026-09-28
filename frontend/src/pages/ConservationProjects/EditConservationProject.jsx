import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getConservationProjectById,
    deleteConservationProject
} from "../../utils/api";
import ConservationProjectForm from "../../components/ConservationProjectForm";
import "./ConservationProject.css";


function EditConservationProject() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProject = async () => {
            try {
                const data =
                    await getConservationProjectById(id);

                setProject(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [id]);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this conservation project?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteConservationProject(id);

            navigate("/conservation-projects");
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="page loading-state">
                <p>Loading project...</p>
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

    return (
        <div className="page form-page">

            <h1>Edit Conservation Project</h1>

            <ConservationProjectForm
                project={project}
                onSuccess={() =>
                    navigate("/conservation-projects")
                }
                onCancel={() =>
                    navigate("/conservation-projects")
                }
            />

            <div className="danger-zone">

                <h2>Danger Zone</h2>

                <p>
                    Deleting this project cannot be undone.
                </p>

                <button
                    className="delete-button"
                    onClick={handleDelete}
                >
                    Delete Conservation Project
                </button>

            </div>

        </div>
    );
}

export default EditConservationProject;
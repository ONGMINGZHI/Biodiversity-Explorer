import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSightingById, updateSighting, deleteSighting } from "../../utils/api";
import "./Sightings.css";
import SightingForm from "../../components/SightingForm";

function EditSighting() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sighting, setSighting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSighting = async () => {
            try {
                const data = await getSightingById(id);
                setSighting(data);
            } catch (error) {
                setError(error.message || "Failed to load sightings.");
            } finally {
                setLoading(false);
            }
        };

        loadSighting();
    }, [id]);

    const handleSubmit = async (data) => {
        await updateSighting(id, data);
        navigate(`/sightings/${id}`);
    };

    const handleDelete = async () => {
        await deleteSighting(id);
        navigate("/sightings");
    };
    if (loading) {
        return (
            <div className="page loading-state">
                <p>Loading sightings...</p>
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
            <div className="page error-state">
                <p className="error-message">Sighting not found.</p>
            </div>
        );
    }

    return <SightingForm initialData={sighting} onSubmit={handleSubmit} onDelete={handleDelete} onCancel={() => navigate(`/sightings/${id}`)} editMode={true} />;
}

export default EditSighting;

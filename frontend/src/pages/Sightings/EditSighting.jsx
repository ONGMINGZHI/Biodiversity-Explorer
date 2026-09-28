import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getSightingById,
    updateSighting,
    deleteSighting
} from "../../utils/api";
import SightingForm from "../../components/SightingForm";
import "./Sightings.css";

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
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadSighting();
    }, [id]);

    const handleSubmit = async (data) => {
        await updateSighting(id, data);
        navigate("/sightings");
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this sighting?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteSighting(id);
            navigate("/sightings");
        } catch (error) {
            setError(error.message);
        }
    };

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
        <div className="page form-page">

            <div className="form-page-header">
                <h1>Edit Wildlife Sighting</h1>

                <p>
                    Update the information for this
                    wildlife observation.
                </p>
            </div>

            <SightingForm
                initialData={sighting}
                isEditing={true}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/sightings")}
                onDelete={handleDelete}
            />

        </div>
    );
}

export default EditSighting;
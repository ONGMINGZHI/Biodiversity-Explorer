import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LocationForm from "../../components/LocationForm";
import { getLocationById, updateLocation, deleteLocation } from "../../utils/api";
import "./Location.css";

function EditLocation() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadLocation = async () => {
            try {
                const data = await getLocationById(id);
                setLocation(data);
            } catch (error) {
                setError(error.message || "Failed to load location.");
            } finally {
                setLoading(false);
            }
        };

        loadLocation();
    }, [id]);

    const handleSubmit = async (data) => {
        await updateLocation(id, data);
        navigate("/locations");
    };

    const handleDelete = async () => {
        await deleteLocation(id);
        navigate("/locations");
    };

    const handleCancel = () => {
        navigate("/locations");
    };

    if (loading) {
        return(
             <div className="page loading-state">
                Loading location...
             </div>
             );
    }

    if (error) {
        return (
            <div className="page error-state">
                <p className="error-message">⚠️{error}</p>
            </div>
        );
    }

    if (!location) {
        return (
            <div className="page error-state">
                <div className="error-message">Location not found.</div>
            </div>
        );
    }

    return <LocationForm initialData={location} onSubmit={handleSubmit} onDelete={handleDelete} onCancel={handleCancel} editMode={true} />;
}

export default EditLocation;

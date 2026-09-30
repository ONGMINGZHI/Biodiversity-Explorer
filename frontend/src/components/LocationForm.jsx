import { useState } from "react";
import "../App.css";

function LocationForm({ initialData = {}, onSubmit, onCancel, onDelete, editMode = false }) {
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        state: initialData.state || "",
        description: initialData.description || "",
        latitude: initialData.latitude ?? "",
        longitude: initialData.longitude ?? "",
    });
    
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        if (!formData.name || !formData.state || !formData.description || formData.latitude === "" || formData.longitude === "") {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            await onSubmit({
                name: formData.name,
                state: formData.state,
                description: formData.description,
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude),
            });
        } catch (error) {
            setError(error.message || "Failed to save location.");
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this location?");

        if (!confirmed) {
            return;
        }

        try {
            await onDelete();
        } catch (error) {
            setError(error.message || "Failed to delete location.");
        }
    };

    return (
        <div className="form-page">
            <div className="form-header">
                <h1>{editMode ? "Edit Location" : "Add New Location"}</h1>

                <p className="form-subtitle">{editMode ? "Update the information for this wildlife location." : "Add a new wildlife location to the Biodiversity Explorer."}</p>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
                {error && <div className="form-error">⚠️ {error}</div>}

                {/* Location Name */}
                <div className="form-group">
                    <label htmlFor="name">Location Name *</label>

                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="e.g. Taman Negara" required />
                </div>

                {/* State */}
                <div className="form-group">
                    <label htmlFor="state">State *</label>

                    <input id="state" name="state" type="text" value={formData.state} onChange={handleChange} placeholder="e.g. Pahang" required />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label htmlFor="description">Description *</label>

                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe this wildlife location..." required />
                </div>

                {/* Coordinates */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="latitude">Latitude *</label>

                        <input id="latitude" name="latitude" type="number" value={formData.latitude} onChange={handleChange} step="any" placeholder="4.5667" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="longitude">Longitude *</label>

                        <input id="longitude" name="longitude" type="number" value={formData.longitude} onChange={handleChange} step="any" placeholder="101.0000" required />
                    </div>
                </div>

                {/* Buttons */}
                <div className="form-actions">
                    <div className="form-actions-left">
                        {editMode && (
                            <button type="button" className="form-button form-button-delete" onClick={handleDelete}>
                                Delete Location
                            </button>
                        )}
                    </div>

                    <div className="form-actions-right">
                        <button type="button" className="form-button form-button-cancel" onClick={onCancel}>
                            Cancel
                        </button>

                        <button type="submit" className="form-button form-button-save">
                            {editMode ? "Save Changes" : "Add Location"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LocationForm;

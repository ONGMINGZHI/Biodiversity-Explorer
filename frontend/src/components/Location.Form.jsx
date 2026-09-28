import { useEffect, useState } from "react";
import { getSpecies, getLocations } from "../utils/api";

function SightingForm({ initialData = {}, onSubmit, onCancel, onDelete, isEditing = false }) {
    const [species, setSpecies] = useState([]);
    const [locations, setLocations] = useState([]);

    const [formData, setFormData] = useState({
        species: initialData.species?._id || initialData.species || "",
        location: initialData.location?._id || initialData.location || "",
        date: initialData.date ? new Date(initialData.date).toISOString().split("T")[0] : "",
        numberObserved: initialData.numberObserved || "",
        notes: initialData.notes || "",
        imageUrl: initialData.imageUrl || "",
    });

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [speciesData, locationsData] = await Promise.all([getSpecies("", "All"), getLocations()]);

                setSpecies(Array.isArray(speciesData) ? speciesData : speciesData.species || []);

                setLocations(Array.isArray(locationsData) ? locationsData : locationsData.locations || []);
            } catch (error) {
                setError(error.message);
            }
        };

        loadOptions();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!formData.species || !formData.location || !formData.date || !formData.numberObserved) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setSaving(true);

            await onSubmit({
                species: formData.species,
                location: formData.location,
                date: formData.date,
                numberObserved: Number(formData.numberObserved),
                notes: formData.notes,
                imageUrl: formData.imageUrl,
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="reusable-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
                <label>
                    Species <span>*</span>
                </label>

                <select name="species" value={formData.species} onChange={handleChange} required>
                    <option value="">Select species</option>

                    {species.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                            {item.scientificName ? ` (${item.scientificName})` : ""}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>
                    Location <span>*</span>
                </label>

                <select name="location" value={formData.location} onChange={handleChange} required>
                    <option value="">Select location</option>

                    {locations.map((location) => (
                        <option key={location._id} value={location._id}>
                            {location.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>
                    Date <span>*</span>
                </label>

                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>
                    Number Observed <span>*</span>
                </label>

                <input type="number" name="numberObserved" min="1" value={formData.numberObserved} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Notes</label>

                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="5" placeholder="Add any observation notes..." />
            </div>

            <div className="form-group">
                <label>Image URL</label>

                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
            </div>

            <div className="form-actions">
                <button type="submit" className="form-submit-button" disabled={saving}>
                    {saving ? "Saving..." : isEditing ? "Update Sighting" : "Add Sighting"}
                </button>

                <button type="button" className="form-cancel-button" onClick={onCancel}>
                    Cancel
                </button>

                {isEditing && onDelete && (
                    <button type="button" className="form-delete-button" onClick={onDelete}>
                        Delete Sighting
                    </button>
                )}
            </div>
        </form>
    );
}

export default SightingForm;

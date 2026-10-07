import { useEffect, useState } from "react";
import {getSpecies} from "../utils/api";
import "../App.css";
import "../pages/Species/Species.css";

function ConservationProjectForm({ initialData = null, onSubmit, onDelete, onCancel, editMode = false }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        organisation: "",
        startDate: "",
        endDate: "",
        status: "Planned",
        species: [],
        imageUrl: "",
        projectUrl: ""
    });

    const [species, setSpecies] = useState([]);
    const [speciesOpen, setSpeciesOpen] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const DEFAULT_IMAGE = "/images/image-coming-soon.png";

    useEffect(() => {
        const loadSpecies = async () => {
            try {
                const data = await getSpecies("", "All");
                setSpecies(Array.isArray(data) ? data : data.species || []);
            } catch (error) {
                setError(error.message || "Failed to load species.");
            }
        };

        loadSpecies();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                organisation: initialData.organisation || "",
                startDate: initialData.startDate
                    ? initialData.startDate.substring(0, 10)
                    : "",
                endDate: initialData.endDate
                    ? initialData.endDate.substring(0, 10)
                    : "",
                status: initialData.status || "Planned",
                species: initialData.species
                    ? initialData.species.map((item) =>
                        typeof item === "object" ? item._id : item
                    )
                    : [],
                imageUrl: initialData.imageUrl || "",
                projectUrl: initialData.projectUrl || ""
            });
        }
    }, [initialData]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSpeciesSelect = (speciesId) => {
        setFormData((previous) => ({
            ...previous,
            species: [...previous.species, speciesId]
        }));

        setSpeciesOpen(false);
    };

    const removeSpecies = (speciesId) => {
        setFormData((previous) => ({
            ...previous,
            species: previous.species.filter((id) => id !== speciesId)
        }));
    };

    const getSpeciesName = (speciesId) => {
        const selectedSpecies = species.find(
            (item) => item._id === speciesId
        );

        return selectedSpecies ? selectedSpecies.name : "Unknown species";
    };

    const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name || !formData.description) {
        setError("Please fill in all required fields.");
        return;
    }

    if (formData.description.length > 300) {
        setError("Description must not exceed 300 characters.");
        return;
    }

    try {
        setLoading(true);
        await onSubmit(formData);
    } catch (error) {
        setError(error.message || "Failed to save conservation project.");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="form-page">
            <div className="form-header">
                <h1>
                    {editMode
                        ? "Edit Conservation Project"
                        : "Add New Conservation Project"}
                </h1>

                <p className="form-subtitle">
                    {editMode
                        ? "Update the information for this conservation project."
                        : "Add a conservation project protecting Malaysia's biodiversity."}
                </p>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
                {error && <div className="form-error">⚠️ {error}</div>}

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">
                            Project Name <span>*</span>
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Juara Turtle Project"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="organisation">
                            Organisation
                        </label>

                        <input
                            id="organisation"
                            name="organisation"
                            type="text"
                            value={formData.organisation}
                            onChange={handleChange}
                            placeholder="e.g. Malaysian Wildlife"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">
                        Description <span>*</span>
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="5"
                        maxLength={300}
                        placeholder="Describe the conservation project..."
                        required
                    />

                    <p className="character-count">
                        {formData.description.length}/300 characters
                    </p>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>

                        <input
                            id="startDate"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>

                        <input
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status</label>

                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Planned">Planned</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Related Species</label>

                    <div className="species-multiselect">
                        <button
                            type="button"
                            className="species-select-box"
                            onClick={() => setSpeciesOpen(!speciesOpen)}
                        >
                            <span>
                                {formData.species.length === 0
                                    ? "Choose species..."
                                    : `${formData.species.length} species selected`}
                            </span>

                            <span className="species-arrow">
                                {speciesOpen ? "▲" : "▼"}
                            </span>
                        </button>

                        {speciesOpen && (
                            <div className="species-dropdown">
                                {species.length === 0 ? (
                                    <div className="species-empty">
                                        No species available.
                                    </div>
                                ) : (
                                    species.map((item) => {
                                        const selected =
                                            formData.species.includes(item._id);

                                        return (
                                            <button
                                                type="button"
                                                key={item._id}
                                                className={`species-option ${
                                                    selected
                                                        ? "species-option-selected"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    !selected &&
                                                    handleSpeciesSelect(item._id)
                                                }
                                                disabled={selected}
                                            >
                                                <span>{item.name}</span>

                                                {selected && (
                                                    <span>✓</span>
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>

                    {formData.species.length > 0 && (
                        <div className="selected-species">
                            {formData.species.map((speciesId) => (
                                <div
                                    className="species-chip"
                                    key={speciesId}
                                >
                                    <span>
                                        {getSpeciesName(speciesId)}
                                    </span>

                                    <button
                                        type="button"
                                        className="species-chip-remove"
                                        onClick={() =>
                                            removeSpecies(speciesId)
                                        }
                                        aria-label={`Remove ${getSpeciesName(
                                            speciesId
                                        )}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <small>
                        Select one or more species related to this project.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="projectUrl">Project Link</label>

                    <input
                        id="projectUrl"
                        name="projectUrl"
                        type="url"
                        value={formData.projectUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/conservation-project"
                    />

                    <small>
                        Add the official website or page for this real-life
                        conservation project.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL</label>

                    <input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                </div>

                <div className="form-group">
                    <label>Image Preview</label>

                    <div className="detail-image">
                        <img
                            src={formData.imageUrl || DEFAULT_IMAGE}
                            alt="Project preview"
                            onError={(event) => {
                                event.currentTarget.src = DEFAULT_IMAGE;
                            }}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <div className="form-actions-left">
                        {editMode && onDelete && (
                            <button
                                type="button"
                                className="form-button form-button-delete"
                                onClick={onDelete}
                                disabled={loading}
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    <div className="form-actions-right">
                        <button
                            type="button"
                            className="form-button form-button-cancel"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="form-button form-button-save"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : editMode
                                    ? "Save Changes"
                                    : "Add Project"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ConservationProjectForm;
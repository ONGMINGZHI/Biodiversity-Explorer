import { useEffect, useState } from "react";
import {
    createConservationProject,
    updateConservationProject,
    getSpecies
} from "../utils/api";


function ConservationProjectForm({
    project = null,
    onSuccess,
    onCancel
}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        organisation: "",
        startDate: "",
        endDate: "",
        status: "Planned",
        species: [],
        imageUrl: ""
    });

    const [species, setSpecies] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isEdit = Boolean(project);

    // Load species for the species selector
    useEffect(() => {
        const loadSpecies = async () => {
            try {
                const data = await getSpecies("", "All");

                setSpecies(data);
            } catch (error) {
                console.error(error);
            }
        };

        loadSpecies();
    }, []);

    // Fill form when editing
    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                description: project.description || "",
                organisation: project.organisation || "",
                startDate: project.startDate
                    ? project.startDate.substring(0, 10)
                    : "",
                endDate: project.endDate
                    ? project.endDate.substring(0, 10)
                    : "",
                status: project.status || "Planned",
                species: project.species
                    ? project.species.map((item) =>
                          typeof item === "object"
                              ? item._id
                              : item
                      )
                    : [],
                imageUrl: project.imageUrl || ""
            });
        }
    }, [project]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSpeciesChange = (event) => {
        const selected = Array.from(
            event.target.selectedOptions,
            (option) => option.value
        );

        setFormData((previous) => ({
            ...previous,
            species: selected
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            if (isEdit) {
                await updateConservationProject(
                    project._id,
                    formData
                );
            } else {
                await createConservationProject(formData);
            }

            onSuccess();
        } catch (error) {
            setError(
                error.message ||
                "Failed to save conservation project."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="reusable-form"
            onSubmit={handleSubmit}
        >

            {error && (
                <div className="form-error">
                    ⚠️ {error}
                </div>
            )}

            {/* Name */}
            <div className="form-group">
                <label htmlFor="name">
                    Project Name
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Description */}
            <div className="form-group">
                <label htmlFor="description">
                    Description
                </label>

                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    required
                />
            </div>

            {/* Organisation */}
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
                />
            </div>

            {/* Dates */}
            <div className="form-row">

                <div className="form-group">
                    <label htmlFor="startDate">
                        Start Date
                    </label>

                    <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="endDate">
                        End Date
                    </label>

                    <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                    />
                </div>

            </div>

            {/* Status */}
            <div className="form-group">
                <label htmlFor="status">
                    Status
                </label>

                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="Planned">
                        Planned
                    </option>

                    <option value="Ongoing">
                        Ongoing
                    </option>

                    <option value="Completed">
                        Completed
                    </option>
                </select>
            </div>

            {/* Species */}
            <div className="form-group">
                <label htmlFor="species">
                    Species
                </label>

                <select
                    id="species"
                    multiple
                    value={formData.species}
                    onChange={handleSpeciesChange}
                >
                    {species.map((item) => (
                        <option
                            key={item._id}
                            value={item._id}
                        >
                            {item.name}
                        </option>
                    ))}
                </select>

                <small>
                    Hold Ctrl while clicking to select
                    multiple species.
                </small>
            </div>

            {/* Image */}
            <div className="form-group">
                <label htmlFor="imageUrl">
                    Image URL
                </label>

                <input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                />
            </div>

            {/* Buttons */}
            <div className="form-actions">

                <button
                    type="button"
                    className="cancel-button"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : isEdit
                            ? "Update Project"
                            : "Add Project"}
                </button>

            </div>

        </form>
    );
}

export default ConservationProjectForm;
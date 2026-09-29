import { useEffect, useState } from "react";
import {
    getHabitats,
    getConservationStatuses,
} from "../utils/api";

function SpeciesForm({
    initialData = {},
    onSubmit,
    onCancel,
    onDelete,
    editMode = false,
}) {
    const [formData, setFormData] = useState({
        name: "",
        scientificName: "",

        // Taxonomy
        kingdom: "",
        phylum: "",
        className: "",
        order: "",
        family: "",
        genus: "",

        description: "",
        habitat: "",
        region: "",
        conservationStatus: "",

        imageUrl: "",
        imageCredit: "",
        imageSource: "",
        imageLicense: "",

        interestingFacts: "",
    });

    const [habitats, setHabitats] = useState([]);
    const [conservationStatuses, setConservationStatuses] = useState([]);

    const [loadingOptions, setLoadingOptions] = useState(true);
    const [error, setError] = useState("");

    // Load existing species data when editing
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData({
                name: initialData.name || "",
                scientificName: initialData.scientificName || "",

                // Taxonomy
                kingdom: initialData.kingdom || "",
                phylum: initialData.phylum || "",
                className: initialData.className || "",
                order: initialData.order || "",
                family: initialData.family || "",
                genus: initialData.genus || "",

                description: initialData.description || "",

                habitat:
                    initialData.habitat?._id ||
                    initialData.habitat ||
                    "",

                region: initialData.region || "",

                conservationStatus:
                    initialData.conservationStatus?._id ||
                    initialData.conservationStatus ||
                    "",

                imageUrl: initialData.imageUrl || "",
                imageCredit: initialData.imageCredit || "",
                imageSource: initialData.imageSource || "",
                imageLicense: initialData.imageLicense || "",

                interestingFacts:
                    Array.isArray(initialData.interestingFacts)
                        ? initialData.interestingFacts.join("\n")
                        : initialData.interestingFacts || "",
            });
        }
    }, [initialData]);

    // Load habitats and conservation statuses
    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoadingOptions(true);

                const [habitatData, statusData] = await Promise.all([
                    getHabitats(),
                    getConservationStatuses(),
                ]);

                setHabitats(habitatData);
                setConservationStatuses(statusData);
            } catch (error) {
                setError(
                    error.message ||
                        "Failed to load habitat and conservation status."
                );
            } finally {
                setLoadingOptions(false);
            }
        };

        loadOptions();
    }, []);

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

        const data = {
            ...formData,

            // Convert facts from textarea into an array
            interestingFacts: formData.interestingFacts
                .split("\n")
                .map((fact) => fact.trim())
                .filter((fact) => fact !== ""),
        };

        try {
            await onSubmit(data);
        } catch (error) {
            setError(
                error.message ||
                    "Failed to save species."
            );
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this species?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await onDelete();
        } catch (error) {
            setError(
                error.message ||
                    "Failed to delete species."
            );
        }
    };

    return (
        <div className="form-page">

            {/* Header */}
            <div className="form-header">
                <h1>
                    {editMode
                        ? "Edit Species"
                        : "Add New Species"}
                </h1>

                <p className="form-subtitle">
                    {editMode
                        ? "Update the information for this species."
                        : "Add a new species to the Biodiversity Explorer."}
                </p>
            </div>

            {/* Form */}
            <form
                className="form-card"
                onSubmit={handleSubmit}
            >

                {error && (
                    <div className="form-error">
                        ⚠️ {error}
                    </div>
                )}

                {/* Name + Scientific Name */}
                <div className="form-row">

                    <div className="form-group">
                        <label htmlFor="name">
                            Common Name *
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

                    <div className="form-group">
                        <label htmlFor="scientificName">
                            Scientific Name *
                        </label>

                        <input
                            id="scientificName"
                            name="scientificName"
                            type="text"
                            value={formData.scientificName}
                            onChange={handleChange}
                            placeholder="e.g. Elephas maximus"
                            required
                        />
                    </div>

                </div>

                {/* Taxonomy */}
                <div className="taxonomy-section">

                    <h2>Taxonomy</h2>

                    <p className="form-help">
                        Enter the biological classification of this species.
                    </p>

                    {/* Kingdom + Phylum */}
                    <div className="form-row">

                        <div className="form-group">
                            <label htmlFor="kingdom">
                                Kingdom *
                            </label>

                            <input
                                id="kingdom"
                                name="kingdom"
                                type="text"
                                value={formData.kingdom}
                                onChange={handleChange}
                                placeholder="e.g. Animalia"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phylum">
                                Phylum *
                            </label>

                            <input
                                id="phylum"
                                name="phylum"
                                type="text"
                                value={formData.phylum}
                                onChange={handleChange}
                                placeholder="e.g. Chordata"
                                required
                            />
                        </div>

                    </div>

                    {/* Class + Order */}
                    <div className="form-row">

                        <div className="form-group">
                            <label htmlFor="className">
                                Class *
                            </label>

                            <input
                                id="className"
                                name="className"
                                type="text"
                                value={formData.className}
                                onChange={handleChange}
                                placeholder="e.g. Mammalia"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="order">
                                Order *
                            </label>

                            <input
                                id="order"
                                name="order"
                                type="text"
                                value={formData.order}
                                onChange={handleChange}
                                placeholder="e.g. Proboscidea"
                                required
                            />
                        </div>

                    </div>

                    {/* Family + Genus */}
                    <div className="form-row">

                        <div className="form-group">
                            <label htmlFor="family">
                                Family *
                            </label>

                            <input
                                id="family"
                                name="family"
                                type="text"
                                value={formData.family}
                                onChange={handleChange}
                                placeholder="e.g. Elephantidae"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="genus">
                                Genus *
                            </label>

                            <input
                                id="genus"
                                name="genus"
                                type="text"
                                value={formData.genus}
                                onChange={handleChange}
                                placeholder="e.g. Elephas"
                                required
                            />
                        </div>

                    </div>

                </div>

                {/* Region */}
                <div className="form-group">
                    <label htmlFor="region">
                        Region *
                    </label>

                    <input
                        id="region"
                        name="region"
                        type="text"
                        value={formData.region}
                        onChange={handleChange}
                        placeholder="e.g. Peninsular Malaysia"
                        required
                    />
                </div>

                {/* Habitat + Conservation Status */}
                <div className="form-row">

                    <div className="form-group">
                        <label htmlFor="habitat">
                            Habitat *
                        </label>

                        <select
                            id="habitat"
                            name="habitat"
                            value={formData.habitat}
                            onChange={handleChange}
                            required
                            disabled={loadingOptions}
                        >
                            <option value="">
                                {loadingOptions
                                    ? "Loading habitats..."
                                    : "Select habitat"}
                            </option>

                            {habitats.map((habitat) => (
                                <option
                                    key={habitat._id}
                                    value={habitat._id}
                                >
                                    {habitat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="conservationStatus">
                            Conservation Status *
                        </label>

                        <select
                            id="conservationStatus"
                            name="conservationStatus"
                            value={formData.conservationStatus}
                            onChange={handleChange}
                            required
                            disabled={loadingOptions}
                        >
                            <option value="">
                                {loadingOptions
                                    ? "Loading statuses..."
                                    : "Select status"}
                            </option>

                            {conservationStatuses.map((status) => (
                                <option
                                    key={status._id}
                                    value={status._id}
                                >
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

                {/* Description */}
                <div className="form-group">
                    <label htmlFor="description">
                        Description *
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe this species..."
                        required
                    />
                </div>

                {/* Image URL */}
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

                {/* Image Credit + License */}
                <div className="form-row">

                    <div className="form-group">
                        <label htmlFor="imageCredit">
                            Image Credit
                        </label>

                        <input
                            id="imageCredit"
                            name="imageCredit"
                            type="text"
                            value={formData.imageCredit}
                            onChange={handleChange}
                            placeholder="Photographer / creator"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageLicense">
                            Image License
                        </label>

                        <input
                            id="imageLicense"
                            name="imageLicense"
                            type="text"
                            value={formData.imageLicense}
                            onChange={handleChange}
                            placeholder="e.g. CC BY-SA 2.0"
                        />
                    </div>

                </div>

                {/* Image Source */}
                <div className="form-group">
                    <label htmlFor="imageSource">
                        Image Source
                    </label>

                    <input
                        id="imageSource"
                        name="imageSource"
                        type="url"
                        value={formData.imageSource}
                        onChange={handleChange}
                        placeholder="https://..."
                    />
                </div>

                {/* Image Preview */}
                {formData.imageUrl && (
                    <div className="form-group">

                        <label>
                            Image Preview
                        </label>

                        <div className="form-image-preview">
                            <img
                                src={formData.imageUrl}
                                alt="Preview"
                                onError={(event) => {
                                    event.currentTarget.style.display =
                                        "none";
                                }}
                            />
                        </div>

                    </div>
                )}

                {/* Interesting Facts */}
                <div className="form-group">
                    <label htmlFor="interestingFacts">
                        Interesting Facts
                    </label>

                    <textarea
                        id="interestingFacts"
                        name="interestingFacts"
                        value={formData.interestingFacts}
                        onChange={handleChange}
                        placeholder={
                            "Enter one fact per line.\nExample: Can swim long distances.\nExample: Mainly active at night."
                        }
                    />

                    <small>
                        Enter one fact per line.
                    </small>
                </div>

                {/* Buttons */}
                <div className="form-actions">

                    {/* Delete */}
                    <div className="form-actions-left">

                        {editMode && (
                            <button
                                type="button"
                                className="form-button form-button-delete"
                                onClick={handleDelete}
                            >
                                Delete Species
                            </button>
                        )}

                    </div>

                    {/* Cancel + Save */}
                    <div className="form-actions-right">

                        <button
                            type="button"
                            className="form-button form-button-cancel"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="form-button form-button-save"
                        >
                            {editMode
                                ? "Save Changes"
                                : "Add Species"}
                        </button>

                    </div>

                </div>

            </form>

        </div>
    );
}

export default SpeciesForm;

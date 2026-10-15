import { useEffect, useState } from "react";
import { getHabitats, getConservationStatuses, getTaxonomies } from "../utils/api";
import "../App.css";
import "../pages/Species/Species.css";

function SpeciesForm({ initialData = {}, onSubmit, onCancel, onDelete, editMode = false }) {
    const [formData, setFormData] = useState({
        name: "",
        scientificName: "",
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
    const [taxonomies, setTaxonomies] = useState([]);

    const [habitatSearch, setHabitatSearch] = useState("");
    const [showHabitatResults, setShowHabitatResults] = useState(false);

    const [loadingOptions, setLoadingOptions] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            console.log("EDIT DATA:", initialData);

            const selectedHabitat = initialData.habitat?._id || initialData.habitat || "";

            setFormData({
                name: initialData.name || "",
                scientificName: initialData.scientificName || "",
                kingdom: initialData.kingdom || "",
                phylum: initialData.phylum || "",
                className: initialData.className || "",
                order: initialData.order || "",
                family: initialData.family || "",
                genus: initialData.genus || "",
                description: initialData.description || "",
                habitat: selectedHabitat,
                region: initialData.region || "",
                conservationStatus: initialData.conservationStatus?._id || initialData.conservationStatus || "",
                imageUrl: initialData.imageUrl || "",
                imageCredit: initialData.imageCredit || "",
                imageSource: initialData.imageSource || "",
                imageLicense: initialData.imageLicense || "",
                interestingFacts: Array.isArray(initialData.interestingFacts) ? initialData.interestingFacts.join("\n") : initialData.interestingFacts || "",
            });

            if (initialData.habitat?.name) {
                setHabitatSearch(initialData.habitat.name);
            }
        }
    }, [initialData]);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoadingOptions(true);
                setError("");

                const [habitatData, statusData, taxonomyData] = await Promise.all([getHabitats(), getConservationStatuses(), getTaxonomies()]);

                setHabitats(Array.isArray(habitatData) ? habitatData : []);
                setConservationStatuses(Array.isArray(statusData) ? statusData : []);
                setTaxonomies(Array.isArray(taxonomyData) ? taxonomyData : []);
            } catch (error) {
                setError(error.message || "Failed to load form options.");
            } finally {
                setLoadingOptions(false);
            }
        };

        loadOptions();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        // exp:{kingdom,Animalia}

        setFormData((prev) => {
            const updated = {
                ...prev,
                [name]: value,
            };

            if (name === "kingdom") {
                updated.phylum = "";
                updated.className = "";
                updated.order = "";
                updated.family = "";
                updated.genus = "";
            }

            if (name === "phylum") {
                updated.className = "";
                updated.order = "";
                updated.family = "";
                updated.genus = "";
            }

            if (name === "className") {
                updated.order = "";
                updated.family = "";
                updated.genus = "";
            }

            if (name === "order") {
                updated.family = "";
                updated.genus = "";
            }

            if (name === "family") {
                updated.genus = "";
            }

            return updated;
        });
    };

    const getParentId = (item) => {
    if (!item.parent) return null;
    return typeof item.parent === "object" ? item.parent._id : item.parent;
};
// if no parebt:null, if got, return _id, or populate in mongoose will show all

    const getTaxonomyEntry = (rank, name, parentId = null) => taxonomies.find((item) => item.rank === rank && item.name === name && String(getParentId(item) || "") === String(parentId || ""));
    // use string to compare more easy

    const getTaxonomyChildren = (parentId, rank) => taxonomies.filter((item) => item.rank === rank && String(getParentId(item) || "") === String(parentId || "")).sort((a, b) => a.name.localeCompare(b.name));


    // the ?._id is use to access the id when parent exist
    const kingdomOptions = getTaxonomyChildren(null, "kingdom");

    const selectedKingdom = getTaxonomyEntry("kingdom", formData.kingdom);
    const selectedPhylum = getTaxonomyEntry("phylum", formData.phylum, selectedKingdom?._id);
    const selectedClass = getTaxonomyEntry("class", formData.className, selectedPhylum?._id);
    const selectedOrder = getTaxonomyEntry("order", formData.order, selectedClass?._id);
    const selectedFamily = getTaxonomyEntry("family", formData.family, selectedOrder?._id);

    const phylumOptions = getTaxonomyChildren(selectedKingdom?._id, "phylum");
    const classOptions = getTaxonomyChildren(selectedPhylum?._id, "class");
    const orderOptions = getTaxonomyChildren(selectedClass?._id, "order");
    const familyOptions = getTaxonomyChildren(selectedOrder?._id, "family");
    const genusOptions = getTaxonomyChildren(selectedFamily?._id, "genus");

    // Handle habitat search
    const handleHabitatSearch = (event) => {
        const value = event.target.value;
        setHabitatSearch(value);
        setShowHabitatResults(true);
        if (!value) {
            setFormData((prev) => ({ ...prev, habitat: "" }));
        }
    };
    // Select habitat
    const handleHabitatSelect = (habitat) => {
        setFormData((prev) => ({ ...prev, habitat: habitat._id }));
        setHabitatSearch(habitat.name);
        setShowHabitatResults(false); 
    };
    //  Filter habitats based on search
    const filteredHabitats = habitats.filter((habitat) => habitat.name.toLowerCase().includes(habitatSearch.toLowerCase()));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        // If previous submission failed, its message disappear when the user try again.

        if (!formData.habitat) {
            setError("Please select a habitat.");
            return;
        }

        if (formData.description.length > 300) {
            setError("Description must not exceed 300 characters.");
            return;
        }

        const facts = formData.interestingFacts
            .split("\n")
            .map((fact) => fact.trim())
            .filter((fact) => fact !== "");
            // new line, remove space, remove empty line

        if (facts.length > 5) {
            setError("You can enter a maximum of 5 interesting facts.");
            return;
        }

        if (facts.some((fact) => fact.length > 200)) {
            setError("Each interesting fact must not exceed 200 characters.");
            return;
            // if 1 of the fact >200 will not continue (.some)
        }

        const data = {
            ...formData,
            interestingFacts: facts,
        };

        try {
            await onSubmit(data);
        } catch (error) {
            setError(error.message || "Failed to save species.");
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this species?");

        if (!confirmed) {
            return;
        }

        try {
            await onDelete();
        } catch (error) {
            setError(error.message || "Failed to delete species.");
        }
    };
    const DEFAULT_IMAGE = "/images/image-coming-soon.png";
    return (
        <div className="form-page">
            <div className="form-header">
                <h1>{editMode ? "Edit Species" : "Add New Species"}</h1>

                <p className="form-subtitle">{editMode ? "Update the information for this species." : "Add a new species to the Biodiversity Explorer."}</p>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
                {error && <div className="form-error">⚠️ {error}</div>}

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">Common Name *</label>

                        <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="e.g Asian elephant" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="scientificName">Scientific Name *</label>

                        <input id="scientificName" name="scientificName" type="text" value={formData.scientificName} onChange={handleChange} placeholder="e.g. Elephas maximus" required />
                    </div>
                </div>

                <div className="taxonomy-section">
                    <h2>Taxonomy</h2>

                    <p className="form-help">Select the biological classification of this species.</p>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="kingdom">Kingdom *</label>

                            <select id="kingdom" name="kingdom" value={formData.kingdom} onChange={handleChange} required>
                                <option value="">Select kingdom</option>

                                {kingdomOptions.map((item) => (
                                    <option key={item._id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phylum">Phylum *</label>

                            <select id="phylum" name="phylum" value={formData.phylum} onChange={handleChange} disabled={!formData.kingdom} required>
                                <option value="">{!formData.kingdom ? "Select kingdom first" : "Select phylum"}</option>

                                {phylumOptions.map((item) => (
                                    <option key={item._id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="className">Class *</label>

                            <select id="className" name="className" value={formData.className} onChange={handleChange} disabled={!formData.phylum} required>
                                <option value="">{!formData.phylum ? "Select phylum first" : "Select class"}</option>

                                {classOptions.map((item) => (
                                    <option key={item._id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="order">Order *</label>

                            <select id="order" name="order" value={formData.order} onChange={handleChange} disabled={!formData.className} required>
                                <option value="">{!formData.className ? "Select class first" : "Select order"}</option>

                                {orderOptions.map((item) => (
                                    <option key={item._id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="family">Family *</label>

                            <select id="family" name="family" value={formData.family} onChange={handleChange} disabled={!formData.order} required>
                                <option value="">{!formData.order ? "Select order first" : "Select family"}</option>

                                {familyOptions.map((item) => (
                                    <option key={item._id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="genus">Genus *</label>

                            <select id="genus" name="genus" value={formData.genus} onChange={handleChange} disabled={!formData.family} required>
                                <option value="">{!formData.family ? "Select family first" : "Select genus"}</option>

                                {genusOptions.map((item) => (
                                    <option key={item._id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="region">Region *</label>

                    <input id="region" name="region" type="text" value={formData.region} onChange={handleChange} placeholder="e.g. Peninsular Malaysia" required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="habitatSearch">Habitat *</label>

                        <div className="habitat-search-wrapper">
                            <input id="habitatSearch" type="text" value={habitatSearch} onChange={handleHabitatSearch} onFocus={() => setShowHabitatResults(true)} placeholder={loadingOptions ? "Loading habitats..." : "Search habitat..."} disabled={loadingOptions} autoComplete="off" />

                            {showHabitatResults && habitatSearch && (
                                <div className="habitat-search-results">
                                    {filteredHabitats.length > 0 ? (
                                        filteredHabitats.map((habitat) => (
                                            <button key={habitat._id} type="button" className="habitat-result" onClick={() => handleHabitatSelect(habitat)}>
                                                {habitat.name}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="habitat-no-results">No habitats found.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="conservationStatus">Conservation Status *</label>

                        <select id="conservationStatus" name="conservationStatus" value={formData.conservationStatus} onChange={handleChange} required disabled={loadingOptions}>
                            <option value="">{loadingOptions ? "Loading statuses..." : "Select status"}</option>

                            {conservationStatuses.map((status) => (
                                <option key={status._id} value={status._id}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description *</label>

                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} maxLength={300} placeholder="Describe this species..." required />

                    <p className="character-count">{formData.description.length}/300 characters</p>
                </div>

                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL</label>

                    <input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="imageCredit">Image Credit</label>

                        <input id="imageCredit" name="imageCredit" type="text" value={formData.imageCredit} onChange={handleChange} placeholder="Photographer / creator" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageLicense">Image License</label>

                        <input id="imageLicense" name="imageLicense" type="text" value={formData.imageLicense} onChange={handleChange} placeholder="e.g. CC BY-SA 2.0" />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="imageSource">Image Source</label>

                    <input id="imageSource" name="imageSource" type="url" value={formData.imageSource} onChange={handleChange} placeholder="https://..." />
                </div>

                <div className="form-group">
                    <label>Image Preview</label>

                    <div className="detail-image">
                        <img
                            src={formData.imageUrl || DEFAULT_IMAGE}
                            alt="Preview"
                            onError={(event) => {
                                event.currentTarget.src = DEFAULT_IMAGE;
                            }}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="interestingFacts">Interesting Facts</label>

                    <textarea id="interestingFacts" name="interestingFacts" value={formData.interestingFacts} onChange={handleChange} maxLength={750} placeholder={"Enter one fact per line.\nExample: Can swim long distances.\nExample: Mainly active at night."} />

                    <p className="character-count">{formData.interestingFacts.length}/750 characters</p>

                    <small>Enter up to 5 facts, one fact per line.</small>
                </div>

                <div className="form-actions">
                    <div className="form-actions-left">
                        {editMode && (
                            <button type="button" className="form-button form-button-delete" onClick={handleDelete}>
                                Delete Species
                            </button>
                        )}
                    </div>

                    <div className="form-actions-right">
                        <button type="button" className="form-button form-button-cancel" onClick={onCancel}>
                            Cancel
                        </button>

                        <button type="submit" className="form-button form-button-save">
                            {editMode ? "Save Changes" : "Add Species"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SpeciesForm;

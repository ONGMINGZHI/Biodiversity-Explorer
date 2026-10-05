import { useEffect, useState } from "react";
import { getSpecies, getLocations } from "../utils/api";

function SightingForm({ initialData = {}, onSubmit, onCancel, onDelete, isEditing = false }) {
    const [species, setSpecies] = useState([]);
    const [locations, setLocations] = useState([]);

    const [speciesSearch, setSpeciesSearch] = useState(initialData.species?.name ? `${initialData.species.name}${initialData.species.scientificName ? ` (${initialData.species.scientificName})` : ""}` : "");

    const [locationSearch, setLocationSearch] = useState(initialData.location?.name ? `${initialData.location.name}${initialData.location.state ? ` (${initialData.location.state})` : ""}` : "");

    const [showSpeciesResults, setShowSpeciesResults] = useState(false);
    const [showLocationResults, setShowLocationResults] = useState(false);

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
    const [loadingOptions, setLoadingOptions] = useState(true);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoadingOptions(true);
                setError("");

                const [speciesData, locationsData] = await Promise.all([getSpecies("", "All"), getLocations()]);

                setSpecies(Array.isArray(speciesData) ? speciesData : speciesData.species || []);

                setLocations(Array.isArray(locationsData) ? locationsData : locationsData.locations || []);
            } catch (error) {
                setError(error.message || "Failed to load options.");
            } finally {
                setLoadingOptions(false);
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

    // Search species
    const handleSpeciesSearch = (event) => {
        const value = event.target.value;

        setSpeciesSearch(value);
        setShowSpeciesResults(true);

        if (!value) {
            setFormData((previous) => ({
                ...previous,
                species: "",
            }));
        }
    };

    // Select species
    const handleSpeciesSelect = (selectedSpecies) => {
        setFormData((previous) => ({
            ...previous,
            species: selectedSpecies._id,
        }));

        setSpeciesSearch(`${selectedSpecies.name}${selectedSpecies.scientificName ? ` (${selectedSpecies.scientificName})` : ""}`);

        setShowSpeciesResults(false);
    };

    // Filter species
    const filteredSpecies = species.filter((item) => item.name.toLowerCase().includes(speciesSearch.toLowerCase()) || item.scientificName?.toLowerCase().includes(speciesSearch.toLowerCase()));

    // Search location
    const handleLocationSearch = (event) => {
        const value = event.target.value;

        setLocationSearch(value);
        setShowLocationResults(true);

        if (!value) {
            setFormData((previous) => ({
                ...previous,
                location: "",
            }));
        }
    };

    // Select location
    const handleLocationSelect = (selectedLocation) => {
        setFormData((previous) => ({
            ...previous,
            location: selectedLocation._id,
        }));

        setLocationSearch(`${selectedLocation.name}${selectedLocation.state ? ` (${selectedLocation.state})` : ""}`);

        setShowLocationResults(false);
    };

    // Filter locations
    const filteredLocations = locations.filter((location) => location.name.toLowerCase().includes(locationSearch.toLowerCase()) || location.state?.toLowerCase().includes(locationSearch.toLowerCase()));

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!formData.species || !formData.location || !formData.date || !formData.numberObserved) {
            setError("Please fill in all required fields.");
            return;
        }

        if (formData.notes.length > 300) {
            setError("Notes must not exceed 300 characters.");
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
            setError(error.message || "Failed to save sighting.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="reusable-form" onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
                <label htmlFor="speciesSearch">
                    Species <span>*</span>
                </label>

                <div className="habitat-search-wrapper">
                    <input id="speciesSearch" type="text" value={speciesSearch} onChange={handleSpeciesSearch} onFocus={() => setShowSpeciesResults(true)} placeholder={loadingOptions ? "Loading species..." : "Search species..."} disabled={loadingOptions} autoComplete="off" />

                    {showSpeciesResults && speciesSearch && (
                        <div className="habitat-search-results">
                            {filteredSpecies.length > 0 ? (
                                filteredSpecies.map((item) => (
                                    <button key={item._id} type="button" className="habitat-result" onClick={() => handleSpeciesSelect(item)}>
                                        <strong>{item.name}</strong>
                                        {item.scientificName && (
                                            <>
                                                <br />
                                                <small>{item.scientificName}</small>
                                            </>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <p className="habitat-no-results">No species found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="locationSearch">
                    Location <span>*</span>
                </label>

                <div className="habitat-search-wrapper">
                    <input id="locationSearch" type="text" value={locationSearch} onChange={handleLocationSearch} onFocus={() => setShowLocationResults(true)} placeholder={loadingOptions ? "Loading locations..." : "Search location..."} disabled={loadingOptions} autoComplete="off" />

                    {showLocationResults && locationSearch && (
                        <div className="habitat-search-results">
                            {filteredLocations.length > 0 ? (
                                filteredLocations.map((location) => (
                                    <button key={location._id} type="button" className="habitat-result" onClick={() => handleLocationSelect(location)}>
                                        <strong>{location.name}</strong>
                                        {location.state && (
                                            <>
                                                <br />
                                                <small>{location.state}</small>
                                            </>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <p className="habitat-no-results">No locations found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="date">
                    Date <span>*</span>
                </label>

                <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label htmlFor="numberObserved">
                    Number Observed <span>*</span>
                </label>

                <input id="numberObserved" type="number" name="numberObserved" min="1" value={formData.numberObserved} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes</label>

                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="5" maxLength={300} placeholder="Add any observation notes..." />

                <p className="character-count">{formData.notes.length}/300 characters</p>
            </div>

            <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>

                <input id="imageUrl" type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
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

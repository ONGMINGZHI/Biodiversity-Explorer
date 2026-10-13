import { useEffect, useState } from "react";
import { getTaxonomies } from "../utils/api";
import "../App.css";
import "../pages/Taxonomy/Taxonomy.css";

const ranks = ["kingdom", "phylum", "class", "order", "family", "genus"];

const emptyTaxonomy = {
    name: "",
    rank: "kingdom",
    parent: "",
};
function TaxonomyForm({ initialData = emptyTaxonomy, onSubmit, onCancel, onDelete, editMode = false }) {
    const [formData, setFormData] = useState({
        name: "",
        rank: "kingdom",
        parent: "",
    });
    const [taxonomies, setTaxonomies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const loadTaxonomies = async () => {
            try {
                const data = await getTaxonomies();
                setTaxonomies(Array.isArray(data) ? data : []);
            } catch (err) {
                setLoadError(err.message || "Failed to load taxonomy entries.");
            } finally {
                setLoading(false);
            }
        };
        loadTaxonomies();
    }, []);

    useEffect(() => {
        setFormData({
            name: initialData.name || "",
            rank: initialData.rank || "kingdom",
            parent: typeof initialData.parent === "object"
                ? initialData.parent?._id || ""
                : initialData.parent || "",
        });
    }, [initialData]);

    const rankIndex = ranks.indexOf(formData.rank);
    const parentRank = ranks[rankIndex - 1];

    const getDescendantIds = (id) => {
        const descendants = new Set();
        const addChildren = (parentId) => {
            taxonomies
                .filter((item) => String(item.parent?._id || item.parent || "") === String(parentId))
                .forEach((child) => {
                    if (!descendants.has(child._id)) {
                        descendants.add(child._id);
                        addChildren(child._id);
                    }
                });
        };
        if (id) addChildren(id);
        return descendants;
    };

    const excludedIds = editMode && initialData._id
        ? new Set([initialData._id, ...getDescendantIds(initialData._id)])
        : new Set();

    const parentOptions = rankIndex > 0
        ? taxonomies.filter((item) =>
            item.rank === parentRank && !excludedIds.has(item._id)
        )
        : [];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "rank" ? { parent: "" } : {}),
        }));
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!formData.name.trim()) {
            setError("Taxonomy name is required.");
            return;
        }

        if (formData.rank !== "kingdom" && !formData.parent) {
            setError("Please select a parent taxonomy entry.");
            return;
        }

        setSaving(true);
        try {
            await onSubmit({
                name: formData.name.trim(),
                rank: formData.rank,
                parent: formData.rank === "kingdom" ? null : formData.parent,
            });
        } catch (err) {
            setError(err.message || "Failed to save taxonomy.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this taxonomy entry?")) {
            return;
        }

        setError("");
        setDeleting(true);
        try {
            await onDelete();
        } catch (err) {
            setError(err.message || "Failed to delete taxonomy.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <div className="page loading-state"><p>Loading taxonomy...</p></div>;
    }

    if (loadError) {
        return <div className="page error-state"><p className="error-message">⚠️ {loadError}</p></div>;
    }

    return (
        <div className="form-page">
            <div className="form-header">
                <h1>{editMode ? "Edit Taxonomy" : "Add Taxonomy"}</h1>
                <p className="form-subtitle">
                    {editMode ? "Update this taxonomy." : "Add a taxonomy."}
                </p>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
                {error && <div className="form-error">⚠️ {error}</div>}

                <div className="form-group">
                    <label htmlFor="taxonomy-name">Name *</label>
                    <input
                        id="taxonomy-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Animalia"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="taxonomy-rank">Rank *</label>
                    <select
                        id="taxonomy-rank"
                        name="rank"
                        value={formData.rank}
                        onChange={handleChange}
                        required
                    >
                        {ranks.map((rank) => (
                            <option key={rank} value={rank}>
                                {rank.charAt(0).toUpperCase() + rank.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {formData.rank !== "kingdom" && (
                    <div className="form-group">
                        <label htmlFor="taxonomy-parent">Parent *</label>
                        <select
                            id="taxonomy-parent"
                            name="parent"
                            value={formData.parent}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                {parentOptions.length ? `Select ${parentRank}` : `No ${parentRank} entries available`}
                            </option>
                            {parentOptions.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-actions">
                    <div className="form-actions-left">
                        {editMode && onDelete && (
                            <button
                                type="button"
                                className="form-button form-button-delete"
                                onClick={handleDelete}
                                disabled={deleting || saving}
                            >
                                {deleting ? "Deleting..." : "Delete Taxonomy"}
                            </button>
                        )}
                    </div>
                    <div className="form-actions-right">
                        <button
                            type="button"
                            className="form-button form-button-cancel"
                            onClick={onCancel}
                            disabled={saving || deleting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="form-button form-button-save"
                            disabled={saving || deleting}
                        >
                            {saving ? "Saving..." : editMode ? "Save Changes" : "Add Taxonomy"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default TaxonomyForm;

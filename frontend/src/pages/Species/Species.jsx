import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSpecies } from "../../utils/api";
import "./Species.css";

function Species() {
    const [species, setSpecies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search & taxonomy filters
    const [search, setSearch] = useState("");
    const [kingdom, setKingdom] = useState("All");
    const [className, setClassName] = useState("All");

    // Check admin status
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        const loadSpecies = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getSpecies(
                    search,
                    kingdom,
                    className
                );

                setSpecies(data);
            } catch (err) {
                setError(err.message || "Failed to fetch species.");
            } finally {
                setLoading(false);
            }
        };

        loadSpecies();
    }, [search, kingdom, className]);

    const navigate = useNavigate();

    // Search handler
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    // Kingdom filter handler
    const handleKingdom = (event) => {
        setKingdom(event.target.value);
    };

    // Class filter handler
    const handleClassName = (event) => {
        setClassName(event.target.value);
    };

    if (loading) {
        return (
            <div className="page loading-state">
                <p>Loading species...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page error-state">
                <p className="error-message">
                    ⚠️ Error: {error}
                </p>
            </div>
        );
    }

    return (
        <div className="page species-page">

            {/* Header */}
            <div className="species-header">
                <div>
                    <h1>Species</h1>

                    <p className="subtitle">
                        Explore the rich biodiversity of Malaysia.
                    </p>
                </div>

                {isAdmin && (
                    <button
                        className="add-button"
                        onClick={() => navigate("/species/new")}
                    >
                        + Add Species
                    </button>
                )}
            </div>

            {/* Search and Taxonomy Filters */}
            <div className="species-controls">

                <input
                    type="text"
                    placeholder="Search species..."
                    value={search}
                    onChange={handleSearch}
                    className="search-input"
                />

                <select
                    value={kingdom}
                    onChange={handleKingdom}
                    className="category-select"
                >
                    <option value="All">
                        All Kingdoms
                    </option>

                    <option value="Animalia">
                        Animalia
                    </option>

                    <option value="Plantae">
                        Plantae
                    </option>

                    <option value="Fungi">
                        Fungi
                    </option>
                </select>

                <select
                    value={className}
                    onChange={handleClassName}
                    className="category-select"
                >
                    <option value="All">
                        All Classes
                    </option>

                    <option value="Mammalia">
                        Mammalia
                    </option>

                    <option value="Aves">
                        Aves
                    </option>

                    <option value="Reptilia">
                        Reptilia
                    </option>

                    <option value="Amphibia">
                        Amphibia
                    </option>

                    <option value="Actinopterygii">
                        Actinopterygii
                    </option>

                    <option value="Magnoliopsida">
                        Magnoliopsida
                    </option>
                </select>

            </div>

            {/* Species Count */}
            <p className="species-count">
                {species.length} species found
            </p>

            {/* Species Cards Grid */}
            <div className="species-grid">

                {species.length > 0 ? (

                    species.map((item) => (

                        <div
                            className="species-card"
                            key={item._id}
                        >

                            {item.imageUrl && (
                                <div className="card-image-wrapper">

                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="species-card-image"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />

                                </div>
                            )}

                            <div className="card-content">

                                <h2>{item.name}</h2>

                                <p className="scientific-name">
                                    {item.scientificName}
                                </p>

                                <p className="category-tag">
                                    <strong>Kingdom:</strong>{" "}
                                    {item.kingdom}
                                </p>

                                <p className="category-tag">
                                    <strong>Class:</strong>{" "}
                                    {item.className}
                                </p>

                                <div className="card-footer">

                                    <Link
                                        to={`/species/${item._id}`}
                                        className="view-button"
                                    >
                                        View Details →
                                    </Link>

                                    {/* Admin Controls */}
                                    {isAdmin && (
                                        <div className="admin-buttons">

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/species/edit/${item._id}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                        </div>
                                    )}

                                </div>

                            </div>

                        </div>

                    ))

                ) : (

                    <div className="no-results">
                        <p>
                            No species found matching your criteria.
                        </p>
                    </div>

                )}

            </div>

        </div>
    );
}

export default Species;

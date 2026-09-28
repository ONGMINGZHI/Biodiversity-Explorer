import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSpecies } from "../../utils/api";
import "./Species.css"


function Species() {
    const [species, setSpecies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search and filter
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    // Check admin status safely
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        const loadSpecies = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getSpecies(search, category);

                // Safe fallback checking if API responses structure changes
                setSpecies(data);
            } catch (err) {
                setError(err.message || "Failed to fetch species.");
            } finally {
                setLoading(false);
            }
        };

        loadSpecies();
    }, [search, category]);

    const navigate = useNavigate();

    // Search handler
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    // Category filter handler
    const handleCategory = (event) => {
        setCategory(event.target.value);
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
                <p className="error-message">⚠️ Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="page species-page">
            {/* Header */}
            <div className="species-header">
                <div>
                    <h1>Species</h1>
                    <p className="subtitle">Explore the rich wildlife of Malaysia.</p>
                </div>

                {isAdmin && (
                    <button className="add-button" onClick={() => navigate("/species/new")}>
                        + Add Species
                    </button>
                )}
            </div>

            {/* Search and Filter */}
            <div className="species-controls">
                <input type="text" placeholder="Search species..." value={search} onChange={handleSearch} className="search-input" />

                <select value={category} onChange={handleCategory} className="category-select">
                    <option value="All">All Categories</option>
                    <option value="Mammal">Mammal</option>
                    <option value="Bird">Bird</option>
                    <option value="Reptile">Reptile</option>
                    <option value="Amphibian">Amphibian</option>
                    <option value="Fish">Fish</option>
                    <option value="Invertebrate">Invertebrate</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* Species Count */}
            <p className="species-count">{species.length} species found</p>

            {/* Species Cards Grid */}
            <div className="species-grid">
                {species.length > 0 ? (
                    species.map((item) => (
                        <div className="species-card" key={item._id}>
                            {item.imageUrl && (
                                <div className="card-image-wrapper">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="species-card-image"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                </div>
                            )}

                            <div className="card-content">
                                <h2>{item.name}</h2>
                                <p className="scientific-name">{item.scientificName}</p>
                                <p className="category-tag">
                                    <strong>Category:</strong> {item.category}
                                </p>

                                <div className="card-footer">
                                    <Link to={`/species/${item._id}`} className="view-button">
                                        View Details →
                                    </Link>

                                    {/* Admin Controls inside card */}
                                    {isAdmin && (
                                        <div className="admin-buttons">
                                            <button className="edit-button" onClick={() => navigate(`/species/edit/${item._id}`)}>
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
                        <p>No species found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Species;

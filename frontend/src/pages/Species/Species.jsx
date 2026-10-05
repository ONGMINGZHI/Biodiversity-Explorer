import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSpecies } from "../../utils/api";
import "./Species.css";
import "../../App.css";
function Species() {
    const [species, setSpecies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search & taxonomy filters
    const [search, setSearch] = useState("");
    const [kingdom, setKingdom] = useState("All");
    const [conservationStatus, setConservationStatus] = useState("All");

    // Check admin status
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        const loadSpecies = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getSpecies(search, kingdom, conservationStatus);

                setSpecies(data);
            } catch (err) {
                setError(err.message || "Failed to fetch species.");
            } finally {
                setLoading(false);
            }
        };

        loadSpecies();
    }, [search, kingdom, conservationStatus]);

    const navigate = useNavigate();

    // Search handler
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    // Kingdom filter handler
    const handleKingdom = (event) => {
        setKingdom(event.target.value);
    };

    // status filter handler
    const handleConservationStatus = (event) => {
        setConservationStatus(event.target.value);
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
        <div className="page pageee">
            {/* Header */}
            <div className="headerrrr">
                <div>
                    <h1>Species</h1>

                    <p className="subtitle">Explore the rich biodiversity of Malaysia.</p>
                </div>

                {isAdmin && (
                    <button className="add-button" onClick={() => navigate("/species/new")}>
                        + Add Species
                    </button>
                )}
            </div>

            {/* Search and Taxonomy Filters */}
            <div className="species-controls">
                <input type="text" placeholder="Search species..." value={search} onChange={handleSearch} className="search-input" />

                <select value={kingdom} onChange={handleKingdom} className="category-select">
                    <option value="All">All Kingdoms</option>

                    <option value="Animalia">Animalia</option>

                    <option value="Plantae">Plantae</option>

                    <option value="Fungi">Fungi</option>
                </select>
                <select value={conservationStatus} onChange={handleConservationStatus} className="category-select">
                    <option value="All">All Conservation Status</option>
                    <option value="Critically Endangered">Critically Endangered</option>
                    <option value="Endangered">Endangered</option>
                    <option value="Vulnerable">Vulnerable</option>
                    <option value="Near Threatened">Near Threatened</option>
                    <option value="Least Concern">Least Concern</option>
                    <option value="Data Deficient">Data Deficient</option>
                    <option value="Regionally Extinct">Regionally Extinct</option>
                    <option value="Extinct in the Wild">Extinct in the Wild</option>
                    <option value="Not Evaluated">Not Evaluated</option>
                    <option value="Extinct">Extinct</option>
                </select>
            </div>

            {/* Species Count */}
            <p className="countttt">{species.length} species found</p>

            {/* Species Cards Grid */}
            <div className="gridd">
                {species.length > 0 ? (
                    species.map((item) => (
                        <div className="carddd" key={item._id}>
                            <div className="card-image-wrapper">
                                <img
                                    src={item.imageUrl || "/images/image-coming-soon.png"}
                                    alt={item.name}
                                    className="species-card-image"
                                    onError={(e) => {
                                        e.currentTarget.src = "/images/image-coming-soon.png";
                                    }}
                                />
                            </div>

                            <div className="contenttt">
                                <h2>{item.name}</h2>

                                <p className="scientific-name">{item.scientificName}</p>

                                <p className="category-tag">
                                    <strong>Kingdom:</strong> {item.kingdom}
                                </p>

                                <p className="category-tag">
                                    <strong>Class:</strong> {item.className}
                                </p>

                                <div className="footerr">
                                    <Link to={`/species/${item._id}`} className="view-button">
                                        View Details →
                                    </Link>

                                    {/* Admin Controls */}
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

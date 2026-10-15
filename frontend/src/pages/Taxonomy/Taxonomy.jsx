import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTaxonomies } from "../../utils/api";
import "./Taxonomy.css";
import "../../App.css";

const ranks = ["kingdom", "phylum", "class", "order", "family", "genus"];

function Taxonomy() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";
    const [taxonomies, setTaxonomies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [rankFilter, setRankFilter] = useState("All");
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        const loadTaxonomies = async () => {
            try {
                setLoading(true);
                // data si being retrieved
                setError("");
                // clear previous error
                const data = await getTaxonomies();
                // request taxonomy record
                setTaxonomies(Array.isArray(data) ? data : []);
                // save record and make sure data is array
            } catch (err) {
                setError(err.message || "Failed to load taxonomy.");
            } finally {
                setLoading(false);
            }
        };

        loadTaxonomies();
    }, []);

    // if parent is object, need return its _id or else just parent
    const getParentId = (item) => (typeof item.parent === "object" ? item.parent?._id : item.parent);

    const getChildren = (parentId) => taxonomies.filter((item) => String(getParentId(item) || "") === String(parentId || "")).sort((a, b) => a.name.localeCompare(b.name));

    const matchesSearch = (item) => item.name.toLowerCase().includes(search.trim().toLowerCase());

    const matchesRank = (item) => rankFilter === "All" || item.rank === rankFilter;

    // Keep matching entries and their ancestors visible.
    // combine the 2 filter
    const shouldKeepBranch = (item) => (matchesSearch(item) && matchesRank(item)) || getChildren(item._id).some(shouldKeepBranch);
    // need have at least 1 children

    const toggleNode = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const renderTree = (items, depth = 0) =>
        // depth = 0 mean it will start from kingdom
        items.map((item) => {
            const children = getChildren(item._id);
            const hasChildren = children.length > 0;
            const filtersActive = Boolean(search.trim()) || rankFilter !== "All";
            const isExpanded = Boolean(expanded[item._id]) || filtersActive;

            if (!shouldKeepBranch(item)) return null;
            // no children, no new branch

            return (
                <div className="taxonomy-tree-branch" key={item._id}>
                    <div className="taxonomy-tree-node" style={{ "--tree-depth": depth }}>
                        <button type="button" className="taxonomy-expand" onClick={() => toggleNode(item._id)} disabled={!hasChildren} aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.name}`}>
                            {hasChildren ? (isExpanded ? "▾" : "▸") : "·"}
                        </button>
                        {/* ▾ :expand ▸:collapse . : no children */}

                        <div className="taxonomy-node-label">
                            <span className="taxonomy-node-name">{item.name}</span>
                            <span className={`taxonomy-rank taxonomy-rank-${item.rank}`}>{item.rank}</span>
                        </div>

                        {isAdmin && (
                            <button type="button" className="form-button" onClick={() => navigate(`/taxonomy/edit/${item._id}`)}>
                                Edit
                            </button>
                        )}
                    </div>

                    {hasChildren && isExpanded && <div className="taxonomy-tree-children">{renderTree(children, depth + 1)}</div>}
                    {/* if got expand, render more branch */}
                </div>
            );
        });

    const rootEntries = taxonomies.filter((item) => !getParentId(item)).sort((a, b) => a.name.localeCompare(b.name));

    // no parent one :which is kingdom

    const filteredRootEntries = rootEntries.filter(shouldKeepBranch);

    return (
        <div className="page pageee ">
            <div className="headerrrr">
                <div>
                    <h1>Taxonomy</h1>
                    <p className="subtitle">Explore and manage the classification of biodiversity.</p>
                </div>

                {isAdmin && (
                    <button type="button" className="add-button" onClick={() => navigate("/taxonomy/new")}>
                        + Add Taxonomy
                    </button>
                )}
            </div>

            {error && <p className="error-message">⚠️ {error}</p>}

            <div className="taxonomy-controls">
                <input type="search" className="search-input" placeholder="Search taxonomy..." value={search} onChange={(event) => setSearch(event.target.value)} />

                <select className="category-select" value={rankFilter} onChange={(event) => setRankFilter(event.target.value)}>
                    <option value="All">All Ranks</option>
                    {ranks.map((rank) => (
                        <option key={rank} value={rank}>
                            {rank.charAt(0).toUpperCase() + rank.slice(1)}
                            {/* kingdom-->Kingdom */}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Loading taxonomy...</p>
            ) : (
                <>
                    <p className="countttt">{taxonomies.filter(shouldKeepBranch).length} taxonomy entries found</p>

                    <section className="taxonomy-tree-panel">
                        <div className="taxonomy-panel-heading">
                            <h2>Classification Tree</h2>
                            <span>{taxonomies.length} total entries</span>
                        </div>

                        {filteredRootEntries.length > 0 ? <div className="taxonomy-tree">{renderTree(filteredRootEntries)}</div> : <p className="taxonomy-empty">No taxonomy entries found matching your criteria.</p>}
                    </section>
                </>
            )}
        </div>
    );
}

export default Taxonomy;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaxonomyForm from "../../components/TaxonomyForm";
import { getTaxonomyById, updateTaxonomy, deleteTaxonomy } from "../../utils/api";
import "./Taxonomy.css";

function EditTaxonomy() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [taxonomy, setTaxonomy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadTaxonomy = async () => {
            try {
                const data = await getTaxonomyById(id);
                setTaxonomy(data);
            } catch (error) {
                setError(error.message || "Failed to load taxonomy.");
            } finally {
                setLoading(false);
            }
        };

        loadTaxonomy();
    }, [id]);

    const handleSubmit = async (data) => {
        await updateTaxonomy(id, data);
        navigate("/taxonomy");
    };

    const handleDelete = async () => {
        await deleteTaxonomy(id);
        navigate("/taxonomy");
    };

    if (loading) {
        return (
            <div className="page loading-state">
                <p>Loading taxonomy...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page error-state">
                <p className="error-message">⚠️ {error}</p>
            </div>
        );
    }

    if (!taxonomy) {
        return (
            <div className="page error-state">
                <p className="error-message">Taxonomy not found.</p>
            </div>
        );
    }

    return <TaxonomyForm initialData={taxonomy} onSubmit={handleSubmit} onDelete={handleDelete} onCancel={() => navigate("/taxonomy")} editMode={true} />;
}

export default EditTaxonomy;

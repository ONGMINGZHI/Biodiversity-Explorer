
import { useNavigate } from "react-router-dom";
import TaxonomyForm from "../../components/TaxonomyForm";
import { createTaxonomy } from "../../utils/api";
import "./Taxonomy.css";
function AddTaxonomy() {
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        await createTaxonomy(data);
        navigate("/taxonomy");
    };

    return (
        <TaxonomyForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/taxonomy")}
            editMode={false}
        />
    );
}

export default AddTaxonomy;

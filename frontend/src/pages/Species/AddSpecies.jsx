import { useNavigate } from "react-router-dom";
import SpeciesForm from "../../components/SpeciesForm";
import { createSpecies } from "../../utils/api";
import "./Species.css"
function AddSpecies() {
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        await createSpecies(data);

        navigate("/species");
    };

    return (
        <SpeciesForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/species")}
            editMode={false}
        />
    );
}

export default AddSpecies;
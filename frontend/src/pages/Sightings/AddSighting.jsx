import { useNavigate } from "react-router-dom";
import { createSighting } from "../../utils/api";
import SightingForm from "../../components/SightingForm";
import "./Sightings.css";

function AddSighting() {
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        await createSighting(data);
        navigate("/sightings");
    };

    return (
        <SightingForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/sightings")}
            editMode={false}
        />
    );
}

export default AddSighting;
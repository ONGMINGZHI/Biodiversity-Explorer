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
        <div className="page form-page">
            <div className="form-page-header">
                <h1>Add Wildlife Sighting</h1>

                <p>
                    Record a new wildlife observation.
                </p>
            </div>

            <SightingForm
                onSubmit={handleSubmit}
                onCancel={() => navigate("/sightings")}
            />
        </div>
    );
}

export default AddSighting;
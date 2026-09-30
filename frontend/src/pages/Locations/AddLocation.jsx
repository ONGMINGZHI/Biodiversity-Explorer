import { useNavigate } from "react-router-dom";
import LocationForm from "../../components/LocationForm";
import { createLocation } from "../../utils/api";
import"./Location.css"

function AddLocation() {
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        await createLocation(data);
        navigate("/locations");
    };

    return (
        <LocationForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/locations")}
            editMode={false}
        />
    );
}

export default AddLocation;
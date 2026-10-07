import { useNavigate } from "react-router-dom";
import { createConservationProject } from "../../utils/api";
import ConservationProjectForm from "../../components/ConservationProjectForm";
import "./ConservationProject.css";

function AddConservationProject() {
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        await createConservationProject(data);
        navigate("/conservation-projects");
    };

    return (
        <ConservationProjectForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/conservation-projects")}
            editMode={false}
        />
    );
}

export default AddConservationProject;
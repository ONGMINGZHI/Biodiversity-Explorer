import { useNavigate } from "react-router-dom";
import ConservationProjectForm from "../../components/ConservationProjectForm";
import "./ConservationProject.css";
function AddConservationProject() {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate("/conservation-projects");
    };

    return (
        <div className="page form-page">

            <h1>Add Conservation Project</h1>

            <ConservationProjectForm
                onSuccess={handleSuccess}
                onCancel={() =>
                    navigate("/conservation-projects")
                }
            />

        </div>
    );
}

export default AddConservationProject;
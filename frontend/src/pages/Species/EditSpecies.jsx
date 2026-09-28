import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SpeciesForm from "../../components/SpeciesForm";

import {
    getSpeciesById,
    updateSpecies,
    deleteSpecies,
} from "../../utils/api";
import "./Species.css"


function EditSpecies() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [species, setSpecies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSpecies = async () => {
            try {
                const data = await getSpeciesById(id);

                setSpecies(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadSpecies();
    }, [id]);

    const handleSubmit = async (data) => {
        await updateSpecies(id, data);

        navigate(`/species/${id}`);
    };

    const handleDelete = async () => {
        await deleteSpecies(id);

        navigate("/species");
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
                <p className="error-message">
                    ⚠️ {error}
                </p>
            </div>
        );
    }

    if (!species) {
        return (
            <div className="page error-state">
                <p className="error-message">
                    Species not found.
                </p>
            </div>
        );
    }

    return (
        <SpeciesForm
            initialData={species}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onCancel={() => navigate(`/species/${id}`)}
            editMode={true}
        />
    );
}

export default EditSpecies;
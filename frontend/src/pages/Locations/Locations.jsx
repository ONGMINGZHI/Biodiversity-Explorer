import { useEffect, useState } from "react";
import { getLocations } from "../../utils/api";
import WildlifeMap from "../../components/WildlifeMap";
import "./Location.css";


function Locations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadLocations = async () => {
            try {
                const data = await getLocations();
                setLocations(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadLocations();
    }, []);

    if (loading) {
        return <p>Loading locations...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="page locations-page">
            <h1>Locations</h1>

            <p className="locations-subtitle">Explore wildlife locations across Malaysia.</p>

            {/* Malaysia Wildlife Map */}
            <WildlifeMap locations={locations} />

            {/* Location List */}
            <section className="locations-list-section">
                <div className="locations-grid">
                    {locations.map((location) => (
                        <div className="location-card" key={location._id}>
                            <h3>{location.name}</h3>

                            <p>
                                <strong>State:</strong> {location.state}
                            </p>

                            <p>{location.description}</p>

                            <p>
                                <strong>Latitude:</strong> {location.latitude}
                            </p>

                            <p>
                                <strong>Longitude:</strong> {location.longitude}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Locations;

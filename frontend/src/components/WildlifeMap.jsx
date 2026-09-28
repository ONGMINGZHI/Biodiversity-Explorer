import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function WildlifeMap({ locations }) {
    // Only use locations with valid coordinates
    const validLocations = locations.filter(
        (location) =>
            location.latitude !== undefined &&
            location.longitude !== undefined &&
            !isNaN(Number(location.latitude)) &&
            !isNaN(Number(location.longitude))
    );

    return (
        <div className="locations-map-container">

            <MapContainer
                center={[4.2105, 101.9758]}
                zoom={6}
                minZoom={5}
                maxZoom={15}
                maxBounds={[
                    [0.5, 99.0],
                    [7.5, 120.0]
                ]}
                maxBoundsViscosity={1.0}
                className="locations-map"
            >

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {validLocations.map((location) => (
                    <Marker
                        key={location._id}
                        position={[
                            Number(location.latitude),
                            Number(location.longitude)
                        ]}
                    >
                        <Popup>
                            <div className="location-popup">
                                <h3>{location.name}</h3>

                                <p>
                                    <strong>State:</strong>{" "}
                                    {location.state}
                                </p>

                                <p>
                                    {location.description}
                                </p>

                                <p>
                                    <strong>Coordinates:</strong>{" "}
                                    {location.latitude},{" "}
                                    {location.longitude}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

            </MapContainer>

        </div>
    );
}

export default WildlifeMap;
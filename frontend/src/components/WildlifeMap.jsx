import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

function WildlifeMap({ locations }) {
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

                // Give Leaflet some extra space around Malaysia
                maxBounds={[
                    [-2, 94],
                    [12, 125],
                ]}

                maxBoundsViscosity={0.5}

                scrollWheelZoom={false}
                zoomControl={false}
                doubleClickZoom={false}
                touchZoom={false}

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
                            Number(location.longitude),
                        ]}
                    >
                        <Popup
                            autoPan={true}
                            autoPanPadding={[80, 120]}
                        >
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
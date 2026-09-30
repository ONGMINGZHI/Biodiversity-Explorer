import "./Home.css";

function Home() {
    return (
        <div className="home-page">

            {/* HERO */}
            <section className="home-hero">

                <div className="home-hero-content">

                    <p className="home-label">
                        BIODIVERSITY EXPLORER
                    </p>

                    <h1>
                        Explore Malaysia's
                        <br />
                        Biodiversity
                    </h1>

                    <p className="home-hero-description">
                        Discover Malaysian species, habitats, wildlife
                        sightings and conservation efforts.
                    </p>

                    <div className="home-actions">
                        <a
                            href="/species"
                            className="home-primary-button"
                        >
                            Explore Species
                        </a>

                        <a
                            href="/sightings"
                            className="home-secondary-button"
                        >
                            View Sightings
                        </a>
                    </div>

                </div>

                {/* Elephant sticker */}
                <img
                    src="/elephant.png"
                    alt=""
                    className="home-elephant"
                />

            </section>


            {/* EXPLORE SECTION */}
            <section className="home-section">

                <h2>Explore Biodiversity</h2>

                <p className="home-section-subtitle">
                    Discover Malaysia's wildlife and natural environments.
                </p>

                <div className="home-feature-grid">

                    <div className="home-feature-card">
                        <h3>🐅 Species</h3>

                        <p>
                            Explore information about Malaysian wildlife
                            and their characteristics.
                        </p>

                        <a href="/species">
                            Explore Species →
                        </a>
                    </div>


                    <div className="home-feature-card">
                        <h3>📍 Locations</h3>

                        <p>
                            Explore locations connected to wildlife
                            observations.
                        </p>

                        <a href="/locations">
                            View Locations →
                        </a>
                    </div>


                    <div className="home-feature-card">
                        <h3>🔭 Sightings</h3>

                        <p>
                            Record and explore wildlife sightings
                            across different locations.
                        </p>

                        <a href="/sightings">
                            View Sightings →
                        </a>
                    </div>


                    <div className="home-feature-card">
                        <h3>🐼 Conservation Projects</h3>

                        <p>
                            Explore recent conservation projects
                            of endangered species.
                        </p>

                        <a href="/projects">
                            View Projects →
                        </a>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;
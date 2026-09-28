import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Biodiversity Explorer
                </Link>

                <div className="navbar-links">
                    <Link to="/">Home</Link>

                    <Link to="/species">Species</Link>

                    <Link to="/locations">Locations</Link>

                    <Link to="/sightings">Sightings</Link>

                    <Link to="/conservation-projects">Projects</Link>

                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

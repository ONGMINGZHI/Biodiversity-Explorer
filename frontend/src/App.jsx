import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Species from "./pages/Species/Species";
import AddSpecies from "./pages/Species/AddSpecies";
import EditSpecies from "./pages/Species/EditSpecies";
import SpeciesDetail from "./pages/Species/SpeciesDetail";
import Locations from "./pages/Locations/Locations";
import AddLocation from "./pages/Locations/AddLocation";
import EditLocation from "./pages/Locations/EditLocation";
import Sightings from "./pages/Sightings/Sightings";
import AddSighting from "./pages/Sightings/AddSighting";
import EditSighting from "./pages/Sightings/EditSighting";
import SightingDetail from "./pages/Sightings/SightingDetail";
import ConservationProjects from "./pages/ConservationProjects/ConservationProjects";
import AddConservationProject from "./pages/ConservationProjects/AddConservationProject";
import EditConservationProject from "./pages/ConservationProjects/EditConservationProject";
import ConservationProjectDetail from "./pages/ConservationProjects/ConservationProjectDetail";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/species" element={<Species />} />
                                <Route path="/species/new" element={<AddSpecies />} />
                                <Route path="/species/edit/:id" element={<EditSpecies />} />
                                <Route path="/species/:id" element={<SpeciesDetail />} />

                                <Route path="/locations" element={<Locations />} />
                                <Route path="/locations/add" element={<AddLocation />} />
                                <Route path="/locations/edit/:id" element={<EditLocation />} />

                                <Route path="/sightings" element={<Sightings />} />
                                <Route path="/sightings/new" element={<AddSighting />} />
                                <Route path="/sightings/edit/:id" element={<EditSighting />} />
                                <Route path="/sightings/:id" element={<SightingDetail />} />

                                <Route
                                    path="/conservation-projects"
                                    element={<ConservationProjects />}
                                />

                                <Route
                                    path="/conservation-projects/new"
                                    element={<AddConservationProject />}
                                />

                                <Route
                                    path="/conservation-projects/edit/:id"
                                    element={<EditConservationProject />}
                                />

                                <Route
                                    path="/conservation-projects/:id"
                                    element={<ConservationProjectDetail />}
                                />
                            </Routes>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
export default App;

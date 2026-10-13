import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

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
import Taxonomy from "./pages/Taxonomy/Taxonomy";
import AddTaxonomy from "./pages/Taxonomy/AddTaxonomy";
import EditTaxonomy from "./pages/Taxonomy/EditTaxonomy";
import Footer from "./components/Footer";

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
                                <Route
                                    path="/species/new"
                                    element={
                                        <AdminRoute>
                                            <AddSpecies />
                                        </AdminRoute>
                                    }
                                />
                                <Route
                                    path="/species/edit/:id"
                                    element={
                                        <AdminRoute>
                                            <EditSpecies />
                                        </AdminRoute>
                                    }
                                />
                                <Route path="/species/:id" element={<SpeciesDetail />} />

                                <Route path="/locations" element={<Locations />} />
                                <Route
                                    path="/locations/new"
                                    element={
                                        <AdminRoute>
                                            <AddLocation />
                                        </AdminRoute>
                                    }
                                />
                                <Route
                                    path="/locations/edit/:id"
                                    element={
                                        <AdminRoute>
                                            <EditLocation />
                                        </AdminRoute>
                                    }
                                />

                                <Route path="/sightings" element={<Sightings />} />
                                <Route
                                    path="/sightings/new"
                                    element={
                                        <AdminRoute>
                                            <AddSighting />
                                        </AdminRoute>
                                    }
                                />
                                <Route
                                    path="/sightings/edit/:id"
                                    element={
                                        <AdminRoute>
                                            <EditSighting />
                                        </AdminRoute>
                                    }
                                />
                                <Route path="/sightings/:id" element={<SightingDetail />} />

                                <Route path="/conservation-projects" element={<ConservationProjects />} />
                                <Route
                                    path="/conservation-projects/new"
                                    element={
                                        <AdminRoute>
                                            <AddConservationProject />
                                        </AdminRoute>
                                    }
                                />
                                <Route
                                    path="/conservation-projects/edit/:id"
                                    element={
                                        <AdminRoute>
                                            <EditConservationProject />
                                        </AdminRoute>
                                    }
                                />
                                <Route path="/conservation-projects/:id" element={<ConservationProjectDetail />} />

                                <Route path="/taxonomy" element={<Taxonomy />} />
                                <Route
                                    path="/taxonomy/new"
                                    element={
                                        <AdminRoute>
                                            <AddTaxonomy />
                                        </AdminRoute>
                                    }
                                />
                                <Route
                                    path="/taxonomy/edit/:id"
                                    element={
                                        <AdminRoute>
                                            <EditTaxonomy />
                                        </AdminRoute>
                                    }
                                />
                            </Routes>
                            <Footer />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
export default App;

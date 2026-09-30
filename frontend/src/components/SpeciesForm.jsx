import { useEffect, useState } from "react";
import { getHabitats, getConservationStatuses } from "../utils/api";
import "../App.css";

const taxonomyOptions = {
    Animalia: {
        Chordata: {
            Mammalia: {
                Primates: {
                    Hominidae: ["Homo", "Pongo"],
                    Cercopithecidae: ["Macaca", "Trachypithecus", "Presbytis"],
                    Hylobatidae: ["Hylobates", "Symphalangus"],
                    Tarsiidae: ["Tarsius"],
                },
                Carnivora: {
                    Felidae: ["Panthera", "Neofelis", "Prionailurus", "Catopuma"],
                    Canidae: ["Cuon", "Vulpes"],
                    Ursidae: ["Helarctos"],
                    Mustelidae: ["Aonyx", "Lutra", "Martes", "Mustela", "Helictis"],
                    Viverridae: ["Arctictis", "Paradoxurus", "Viverra", "Cynogale"],
                    Herpestidae: ["Herpestes"],
                },
                Proboscidea: {
                    Elephantidae: ["Elephas"],
                },
                Perissodactyla: {
                    Rhinocerotidae: ["Dicerorhinus"],
                    Tapiridae: ["Tapirus"],
                },
                Artiodactyla: {
                    Bovidae: ["Capricornis", "Bos"],
                    Cervidae: ["Rusa", "Muntiacus", "Axis", "Cervus"],
                    Suidae: ["Sus"],
                    Tragulidae: ["Tragulus"],
                },
                Chiroptera: {
                    Pteropodidae: ["Pteropus", "Cynopterus", "Eonycteris"],
                    Vespertilionidae: ["Pipistrellus", "Myotis", "Kerivoula"],
                    Rhinolophidae: ["Rhinolophus"],
                    Hipposideridae: ["Hipposideros"],
                },
                Rodentia: {
                    Sciuridae: ["Callosciurus", "Ratufa", "Sundasciurus"],
                    Muridae: ["Rattus", "Maxomys"],
                    Hystricidae: ["Hystrix"],
                },
                Pholidota: {
                    Manidae: ["Manis"],
                },
                Lagomorpha: {
                    Leporidae: ["Lepus"],
                },
            },
            Aves: {
                Accipitriformes: {
                    Accipitridae: ["Haliaeetus", "Spilornis", "Ictinaetus", "Nisaetus"],
                },
                Falconiformes: {
                    Falconidae: ["Falco"],
                },
                Strigiformes: {
                    Strigidae: ["Otus", "Glaucidium", "Strix"],
                    Tytonidae: ["Tyto"],
                },
                Bucerotiformes: {
                    Bucerotidae: ["Buceros", "Anthracoceros", "Rhyticeros"],
                },
                Piciformes: {
                    Picidae: ["Dinopium", "Chrysophlegma", "Picus"],
                },
                Psittaciformes: {
                    Psittaculidae: ["Psittacula", "Loriculus"],
                },
                Passeriformes: {
                    Muscicapidae: ["Copsychus", "Cyornis"],
                    Pycnonotidae: ["Pycnonotus"],
                    Timaliidae: ["Stachyris"],
                    Nectariniidae: ["Cinnyris", "Arachnothera"],
                    Dicruridae: ["Dicrurus"],
                    Corvidae: ["Dendrocitta", "Corvus"],
                    Artamidae: ["Artamus"],
                },
                Galliformes: {
                    Phasianidae: ["Lophura", "Argusianus"],
                },
                Anseriformes: {
                    Anatidae: ["Anas", "Dendrocygna"],
                },
                Gruiformes: {
                    Rallidae: ["Amaurornis", "Gallirallus"],
                },
                Pelecaniformes: {
                    Ardeidae: ["Ardea", "Egretta", "Nycticorax"],
                },
                Charadriiformes: {
                    Scolopacidae: ["Tringa", "Calidris"],
                    Charadriidae: ["Charadrius"],
                },
                Coraciiformes: {
                    Alcedinidae: ["Alcedo", "Halcyon"],
                },
            },
            Reptilia: {
                Testudines: {
                    Testudinidae: ["Manouria"],
                    Geoemydidae: ["Cuora", "Heosemys", "Malayemys"],
                    Trionychidae: ["Pelochelys", "Dogania"],
                    Cheloniidae: ["Chelonia", "Eretmochelys", "Lepidochelys"],
                },
                Squamata: {
                    Pythonidae: ["Python"],
                    Viperidae: ["Trimeresurus", "Daboia"],
                    Elapidae: ["Naja", "Bungarus", "Ophiophagus"],
                    Colubridae: ["Ptyas", "Ahaetulla", "Dendrelaphis"],
                    Agamidae: ["Draco", "Bronchocela"],
                    Gekkonidae: ["Gekko", "Cyrtodactylus"],
                    Varanidae: ["Varanus"],
                    Scincidae: ["Eutropis", "Sphenomorphus"],
                },
                Crocodylia: {
                    Crocodylidae: ["Crocodylus"],
                },
            },
            Amphibia: {
                Anura: {
                    Ranidae: ["Rana", "Hylarana"],
                    Dicroglossidae: ["Fejervarya", "Limnonectes"],
                    Rhacophoridae: ["Rhacophorus", "Polypedates"],
                    Bufonidae: ["Duttaphrynus"],
                    Microhylidae: ["Microhyla"],
                },
                Gymnophiona: {
                    Ichthyophiidae: ["Ichthyophis"],
                },
            },
            Actinopterygii: {
                Cypriniformes: {
                    Cyprinidae: ["Barbodes", "Osteochilus", "Tor"],
                    Cobitidae: ["Acantopsis"],
                },
                Siluriformes: {
                    Bagridae: ["Hemibagrus", "Mystus"],
                    Pangasiidae: ["Pangasianodon"],
                    Siluridae: ["Kryptopterus"],
                },
                Perciformes: {
                    Cichlidae: ["Oreochromis"],
                    Osphronemidae: ["Betta", "Trichopodus"],
                    Serranidae: ["Epinephelus"],
                },
                Anabantiformes: {
                    Channidae: ["Channa"],
                },
                Osteoglossiformes: {
                    Notopteridae: ["Notopterus"],
                },
            },
        },
        Arthropoda: {
            Insecta: {
                Lepidoptera: {
                    Nymphalidae: ["Hypolimnas", "Junonia"],
                    Papilionidae: ["Papilio", "Graphium"],
                    Pieridae: ["Appias", "Delias"],
                    Lycaenidae: ["Jamides"],
                    Saturniidae: ["Attacus"],
                },
                Coleoptera: {
                    Scarabaeidae: ["Oryctes", "Protaetia"],
                    Lucanidae: ["Odontolabis"],
                    Cerambycidae: ["Batocera"],
                },
                Hymenoptera: {
                    Apidae: ["Apis", "Xylocopa"],
                    Vespidae: ["Vespa", "Polistes"],
                    Formicidae: ["Oecophylla", "Camponotus"],
                },
                Diptera: {
                    Culicidae: ["Aedes", "Anopheles"],
                    Muscidae: ["Musca"],
                },
                Odonata: {
                    Libellulidae: ["Orthetrum", "Pantala"],
                    Coenagrionidae: ["Ischnura"],
                },
                Orthoptera: {
                    Acrididae: ["Valanga"],
                    Tettigoniidae: ["Mecopoda"],
                },
            },
            Arachnida: {
                Araneae: {
                    Araneidae: ["Argiope", "Nephila"],
                    Salticidae: ["Hyllus"],
                },
                Scorpiones: {
                    Scorpionidae: ["Heterometrus"],
                },
            },
            Malacostraca: {
                Decapoda: {
                    Portunidae: ["Scylla", "Portunus"],
                    Palaemonidae: ["Macrobrachium"],
                },
            },
        },
        Mollusca: {
            Gastropoda: {
                Stylommatophora: {
                    Achatinidae: ["Achatina"],
                },
            },
            Bivalvia: {
                Venerida: {
                    Veneridae: ["Meretrix"],
                },
            },
        },
    },
    Plantae: {
        Tracheophyta: {
            Magnoliopsida: {
                Malpighiales: {
                    Euphorbiaceae: ["Hevea", "Macaranga"],
                    Salicaceae: ["Flacourtia"],
                },
                Fabales: {
                    Fabaceae: ["Acacia", "Albizia", "Dipterocarpus"],
                },
                Myrtales: {
                    Myrtaceae: ["Syzygium", "Eucalyptus"],
                },
                Sapindales: {
                    Anacardiaceae: ["Mangifera"],
                    Rutaceae: ["Citrus"],
                },
                Laurales: {
                    Lauraceae: ["Cinnamomum", "Litsea"],
                },
                Arecales: {
                    Arecaceae: ["Cocos", "Elaeis", "Calamus"],
                },
                Malvales: {
                    Malvaceae: ["Durio", "Hibiscus"],
                },
                Ericales: {
                    Ericaceae: ["Rhododendron"],
                },
                Gentianales: {
                    Rubiaceae: ["Coffea", "Ixora"],
                },
                Lamiales: {
                    Lamiaceae: ["Ocimum"],
                    Acanthaceae: ["Justicia"],
                },
            },
            Liliopsida: {
                Poales: {
                    Poaceae: ["Bambusa", "Dendrocalamus", "Imperata"],
                    Cyperaceae: ["Cyperus"],
                },
                Zingiberales: {
                    Zingiberaceae: ["Zingiber", "Etlingera"],
                    Musaceae: ["Musa"],
                    Marantaceae: ["Maranta"],
                },
                Arecales: {
                    Arecaceae: ["Elaeis", "Calamus"],
                },
                Asparagales: {
                    Orchidaceae: ["Dendrobium", "Bulbophyllum", "Paphiopedilum"],
                },
            },
        },
        Bryophyta: {
            Bryopsida: {
                Bryales: {
                    Bryaceae: ["Bryum"],
                },
            },
        },
        Polypodiopsida: {
            Polypodiales: {
                Polypodiaceae: ["Drynaria"],
                Gleicheniaceae: ["Dicranopteris"],
            },
        },
    },
    Fungi: {
        Agaricomycetes: {
            Agaricales: {
                Agaricaceae: ["Agaricus"],
                Amanitaceae: ["Amanita"],
                Marasmiaceae: ["Marasmius"],
            },
            Polyporales: {
                Polyporaceae: ["Polyporus"],
                Ganodermataceae: ["Ganoderma"],
            },
        },
        Ascomycetes: {
            Pezizales: {
                Morchellaceae: ["Morchella"],
            },
        },
    },
};

function getOptions(object) {
    if (!object) {
        return [];
    }

    if (Array.isArray(object)) {
        return object;
    }

    return Object.keys(object);
}

function SpeciesForm({ initialData = {}, onSubmit, onCancel, onDelete, editMode = false }) {
    const [formData, setFormData] = useState({
        name: "",
        scientificName: "",
        kingdom: "",
        phylum: "",
        className: "",
        order: "",
        family: "",
        genus: "",
        description: "",
        habitat: "",
        region: "",
        conservationStatus: "",
        imageUrl: "",
        imageCredit: "",
        imageSource: "",
        imageLicense: "",
        interestingFacts: "",
    });

    const [habitats, setHabitats] = useState([]);
    const [conservationStatuses, setConservationStatuses] = useState([]);

    const [habitatSearch, setHabitatSearch] = useState("");
    const [showHabitatResults, setShowHabitatResults] = useState(false);

    const [loadingOptions, setLoadingOptions] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            const selectedHabitat = initialData.habitat?._id || initialData.habitat || "";
            setFormData({
                name: initialData.name || "",
                scientificName: initialData.scientificName || "",
                kingdom: initialData.kingdom || "",
                phylum: initialData.phylum || "",
                className: initialData.className || "",
                order: initialData.order || "",
                family: initialData.family || "",
                genus: initialData.genus || "",
                description: initialData.description || "",
                habitat: selectedHabitat,
                region: initialData.region || "",
                conservationStatus: initialData.conservationStatus?._id || initialData.conservationStatus || "",
                imageUrl: initialData.imageUrl || "",
                imageCredit: initialData.imageCredit || "",
                imageSource: initialData.imageSource || "",
                imageLicense: initialData.imageLicense || "",
                interestingFacts: Array.isArray(initialData.interestingFacts) ? initialData.interestingFacts.join("\n") : initialData.interestingFacts || "",
            });
            if (initialData.habitat?.name) {
                setHabitatSearch(initialData.habitat.name);
            }
        }
    }, [initialData]);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoadingOptions(true);

                const [habitatData, statusData] = await Promise.all([getHabitats(), getConservationStatuses()]);

                setHabitats(habitatData);
                setConservationStatuses(statusData);
            } catch (error) {
                setError(error.message || "Failed to load habitat and conservation status.");
            } finally {
                setLoadingOptions(false);
            }
        };

        loadOptions();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => {
            const updated = {
                ...prev,
                [name]: value,
            };

            if (name === "kingdom") {
                updated.phylum = "";
                updated.className = "";
                updated.order = "";
                updated.family = "";
                updated.genus = "";
            }

            if (name === "phylum") {
                updated.className = "";
                updated.order = "";
                updated.family = "";
                updated.genus = "";
            }

            if (name === "className") {
                updated.order = "";
                updated.family = "";
                updated.genus = "";
            }

            if (name === "order") {
                updated.family = "";
                updated.genus = "";
            }

            if (name === "family") {
                updated.genus = "";
            }

            return updated;
        });
    };

    const selectedKingdom = taxonomyOptions[formData.kingdom];
    const selectedPhylum = selectedKingdom?.[formData.phylum];
    const selectedClass = selectedPhylum?.[formData.className];
    const selectedOrder = selectedClass?.[formData.order];
    const selectedFamily = selectedOrder?.[formData.family];

    const phylumOptions = getOptions(selectedKingdom);
    const classOptions = getOptions(selectedPhylum);
    const orderOptions = getOptions(selectedClass);
    const familyOptions = getOptions(selectedOrder);
    const genusOptions = getOptions(selectedFamily).length ? getOptions(selectedFamily) : [];

    // Handle habitat search
    const handleHabitatSearch = (event) => {
        const value = event.target.value;
        setHabitatSearch(value);
        setShowHabitatResults(true);
        if (!value) {
            setFormData((prev) => ({ ...prev, habitat: "" }));
        }
    };
    // Select habitat
    const handleHabitatSelect = (habitat) => {
        setFormData((prev) => ({ ...prev, habitat: habitat._id }));
        setHabitatSearch(habitat.name);
        setShowHabitatResults(false);
    };
    //  Filter habitats based on search
    const filteredHabitats = habitats.filter((habitat) => habitat.name.toLowerCase().includes(habitatSearch.toLowerCase()));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        if (!formData.habitat) {
            setError("Please select a habitat.");
            return;
        }
        const data = {
            ...formData,
            interestingFacts: formData.interestingFacts
                .split("\n")
                .map((fact) => fact.trim())
                .filter((fact) => fact !== ""),
        };

        try {
            await onSubmit(data);
        } catch (error) {
            setError(error.message || "Failed to save species.");
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this species?");

        if (!confirmed) {
            return;
        }

        try {
            await onDelete();
        } catch (error) {
            setError(error.message || "Failed to delete species.");
        }
    };

    return (
        <div className="form-page">
            <div className="form-header">
                <h1>{editMode ? "Edit Species" : "Add New Species"}</h1>

                <p className="form-subtitle">{editMode ? "Update the information for this species." : "Add a new species to the Biodiversity Explorer."}</p>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
                {error && <div className="form-error">⚠️ {error}</div>}

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">Common Name *</label>

                        <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} 
                        placeholder="e.g African elephant" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="scientificName">Scientific Name *</label>

                        <input id="scientificName" name="scientificName" type="text" value={formData.scientificName} onChange={handleChange} placeholder="e.g. Elephas maximus" required />
                    </div>
                </div>

                <div className="taxonomy-section">
                    <h2>Taxonomy</h2>

                    <p className="form-help">Select the biological classification of this species.</p>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="kingdom">Kingdom *</label>

                            <select id="kingdom" name="kingdom" value={formData.kingdom} onChange={handleChange} required>
                                <option value="">Select kingdom</option>

                                <option value="Animalia">Animalia</option>

                                <option value="Plantae">Plantae</option>

                                <option value="Fungi">Fungi</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phylum">Phylum *</label>

                            <select id="phylum" name="phylum" value={formData.phylum} onChange={handleChange} disabled={!formData.kingdom} required>
                                <option value="">{!formData.kingdom ? "Select kingdom first" : "Select phylum"}</option>

                                {phylumOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="className">Class *</label>

                            <select id="className" name="className" value={formData.className} onChange={handleChange} disabled={!formData.phylum} required>
                                <option value="">{!formData.phylum ? "Select phylum first" : "Select class"}</option>

                                {classOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="order">Order *</label>

                            <select id="order" name="order" value={formData.order} onChange={handleChange} disabled={!formData.className} required>
                                <option value="">{!formData.className ? "Select class first" : "Select order"}</option>

                                {orderOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="family">Family *</label>

                            <select id="family" name="family" value={formData.family} onChange={handleChange} disabled={!formData.order} required>
                                <option value="">{!formData.order ? "Select order first" : "Select family"}</option>

                                {familyOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="genus">Genus *</label>

                            <select id="genus" name="genus" value={formData.genus} onChange={handleChange} disabled={!formData.family} required>
                                <option value="">{!formData.family ? "Select family first" : "Select genus"}</option>

                                {genusOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="region">Region *</label>

                    <input id="region" name="region" type="text" value={formData.region} onChange={handleChange} placeholder="e.g. Peninsular Malaysia" required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="habitatSearch">Habitat *</label>

                        <div className="habitat-search-wrapper">
                            <input id="habitatSearch" type="text" value={habitatSearch} onChange={handleHabitatSearch} onFocus={() => setShowHabitatResults(true)} placeholder={loadingOptions ? "Loading habitats..." : "Search habitat..."} disabled={loadingOptions} autoComplete="off" />

                            {showHabitatResults && habitatSearch && (
                                <div className="habitat-search-results">
                                    {filteredHabitats.length > 0 ? (
                                        filteredHabitats.map((habitat) => (
                                            <button key={habitat._id} type="button" className="habitat-result" onClick={() => handleHabitatSelect(habitat)}>
                                                {habitat.name}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="habitat-no-results">No habitats found.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="conservationStatus">Conservation Status *</label>

                        <select id="conservationStatus" name="conservationStatus" value={formData.conservationStatus} onChange={handleChange} required disabled={loadingOptions}>
                            <option value="">{loadingOptions ? "Loading statuses..." : "Select status"}</option>

                            {conservationStatuses.map((status) => (
                                <option key={status._id} value={status._id}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description *</label>

                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe this species..." required />
                </div>

                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL</label>

                    <input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="imageCredit">Image Credit</label>

                        <input id="imageCredit" name="imageCredit" type="text" value={formData.imageCredit} onChange={handleChange} placeholder="Photographer / creator" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageLicense">Image License</label>

                        <input id="imageLicense" name="imageLicense" type="text" value={formData.imageLicense} onChange={handleChange} placeholder="e.g. CC BY-SA 2.0" />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="imageSource">Image Source</label>

                    <input id="imageSource" name="imageSource" type="url" value={formData.imageSource} onChange={handleChange} placeholder="https://..." />
                </div>

                {formData.imageUrl && (
                    <div className="form-group">
                        <label>Image Preview</label>

                        <div className="form-image-preview">
                            <img
                                src={formData.imageUrl}
                                alt="Preview"
                                onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="interestingFacts">Interesting Facts</label>

                    <textarea id="interestingFacts" name="interestingFacts" value={formData.interestingFacts} onChange={handleChange} placeholder={"Enter one fact per line.\nExample: Can swim long distances.\nExample: Mainly active at night."} />

                    <small>Enter one fact per line.</small>
                </div>

                <div className="form-actions">
                    <div className="form-actions-left">
                        {editMode && (
                            <button type="button" className="form-button form-button-delete" onClick={handleDelete}>
                                Delete Species
                            </button>
                        )}
                    </div>

                    <div className="form-actions-right">
                        <button type="button" className="form-button form-button-cancel" onClick={onCancel}>
                            Cancel
                        </button>

                        <button type="submit" className="form-button form-button-save">
                            {editMode ? "Save Changes" : "Add Species"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SpeciesForm;

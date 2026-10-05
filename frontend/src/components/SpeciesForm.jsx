import { useEffect, useState } from "react";
import { getHabitats, getConservationStatuses } from "../utils/api";
import "../App.css";
import "../pages/Species/Species.css";

const taxonomyOptions = {
    Animalia: {
        Chordata: {
            Mammalia: {
                Carnivora: {
                    Felidae: {
                        Panthera: ["Panthera"],
                        Prionailurus: ["Prionailurus"],
                        Neofelis: ["Neofelis"],
                        Pardofelis: ["Pardofelis"],
                    },
                    Mustelidae: {
                        Aonyx: ["Aonyx"],
                        Lutra: ["Lutra"],
                        Martes: ["Martes"],
                        Arctonyx: ["Arctonyx"],
                    },
                    Viverridae: {
                        Viverra: ["Viverra"],
                        Paradoxurus: ["Paradoxurus"],
                        Prionodon: ["Prionodon"],
                        Arctictis: ["Arctictis"],
                    },
                    Ursidae: {
                        Helarctos: ["Helarctos"],
                    },
                    Canidae: {
                        Cuon: ["Cuon"],
                    },
                    Herpestidae: {
                        Herpestes: ["Herpestes"],
                    },
                    Phasianidae: {
                        "": [],
                    },
                },
                Primates: {
                    Hylobatidae: {
                        Hylobates: ["Hylobates"],
                        Symphalangus: ["Symphalangus"],
                    },
                    Cercopithecidae: {
                        Presbytis: ["Presbytis"],
                        Macaca: ["Macaca"],
                        Trachypithecus: ["Trachypithecus"],
                        Nasalis: ["Nasalis"],
                        "Rhinopithecus": ["Rhinopithecus"],
                    },
                    Lorisidae: {
                        Nycticebus: ["Nycticebus"],
                    },
                    Tarsiidae: {
                        Carlito: ["Carlito"],
                    },
                    Pitheciidae: {
                        Pithecia: ["Pithecia"],
                    },
                },
                Proboscidea: {
                    Elephantidae: {
                        Elephas: ["Elephas"],
                    },
                },
                Perissodactyla: {
                    Rhinocerotidae: {
                        Dicerorhinus: ["Dicerorhinus"],
                    },
                },
                Artiodactyla: {
                    Bovidae: {
                        Bos: ["Bos"],
                        Capricornis: ["Capricornis"],
                    },
                    Cervidae: {
                        Rusa: ["Rusa"],
                        Muntiacus: ["Muntiacus"],
                        Axis: ["Axis"],
                    },
                    Suidae: {
                        Sus: ["Sus"],
                        Babyrousa: ["Babyrousa"],
                    },
                    Tragulidae: {
                        Tragulus: ["Tragulus"],
                    },
                },
                Rodentia: {
                    Sciuridae: {
                        Callosciurus: ["Callosciurus"],
                        Ratufa: ["Ratufa"],
                        Sundasciurus: ["Sundasciurus"],
                        Petaurista: ["Petaurista"],
                    },
                    Muridae: {
                        Rattus: ["Rattus"],
                        Maxomys: ["Maxomys"],
                    },
                },
                Chiroptera: {
                    Pteropodidae: {
                        Pteropus: ["Pteropus"],
                        Acerodon: ["Acerodon"],
                        Cynopterus: ["Cynopterus"],
                    },
                    Rhinolophidae: {
                        Rhinolophus: ["Rhinolophus"],
                    },
                },
                Pholidota: {
                    Manidae: {
                        Manis: ["Manis"],
                    },
                },
                Scandentia: {
                    Tupaiidae: {
                        Tupaia: ["Tupaia"],
                    },
                },
            },

            Actinopterygii: {
                Osteoglossiformes: {
                    Osteoglossidae: {
                        Scleropages: ["Scleropages"],
                    },
                    Notopteridae: {
                        Notopterus: ["Notopterus"],
                    },
                },
                Cypriniformes: {
                    Cyprinidae: {
                        Tor: ["Tor"],
                        Barbonymus: ["Barbonymus"],
                        Rasbora: ["Rasbora"],
                    },
                },
                Siluriformes: {
                    Pangasiidae: {
                        Pangasianodon: ["Pangasianodon"],
                    },
                    Bagridae: {
                        Mystus: ["Mystus"],
                    },
                },
                Perciformes: {
                    Osphronemidae: {
                        Betta: ["Betta"],
                        Trichopodus: ["Trichopodus"],
                    },
                },
                Synbranchiformes: {
                    Synbranchidae: {
                        Monopterus: ["Monopterus"],
                    },
                },
            },

            Amphibia: {
                Anura: {
                    Bufonidae: {
                        Phrynoidis: ["Phrynoidis"],
                        Duttaphrynus: ["Duttaphrynus"],
                    },
                    Ranidae: {
                        Amolops: ["Amolops"],
                        Hylarana: ["Hylarana"],
                        Odorrana: ["Odorrana"],
                    },
                    Rhacophoridae: {
                        Rhacophorus: ["Rhacophorus"],
                        Polypedates: ["Polypedates"],
                        Kurixalus: ["Kurixalus"],
                    },
                    Microhylidae: {
                        Microhyla: ["Microhyla"],
                        Kaloula: ["Kaloula"],
                    },
                    Dicroglossidae: {
                        Fejervarya: ["Fejervarya"],
                        Limnonectes: ["Limnonectes"],
                    },
                },
                Gymnophiona: {
                    Ichthyophiidae: {
                        Ichthyophis: ["Ichthyophis"],
                    },
                },
            },

            Reptilia: {
                Squamata: {
                    Pythonidae: {
                        Python: ["Python"],
                    },
                    Varanidae: {
                        Varanus: ["Varanus"],
                    },
                    Elapidae: {
                        Naja: ["Naja"],
                        Ophiophagus: ["Ophiophagus"],
                        Bungarus: ["Bungarus"],
                    },
                    Viperidae: {
                        Trimeresurus: ["Trimeresurus"],
                    },
                    Colubridae: {
                        Ahaetulla: ["Ahaetulla"],
                        Boiga: ["Boiga"],
                    },
                    Agamidae: {
                        Draco: ["Draco"],
                        Gonocephalus: ["Gonocephalus"],
                    },
                    Gekkonidae: {
                        Gekko: ["Gekko"],
                        Cyrtodactylus: ["Cyrtodactylus"],
                    },
                },
                Testudines: {
                    Testudinidae: {
                        Manouria: ["Manouria"],
                    },
                    Geoemydidae: {
                        Batagur: ["Batagur"],
                        Cuora: ["Cuora"],
                        Heosemys: ["Heosemys"],
                    },
                    Cheloniidae: {
                        Chelonia: ["Chelonia"],
                        Eretmochelys: ["Eretmochelys"],
                        Lepidochelys: ["Lepidochelys"],
                    },
                    Dermochelyidae: {
                        Dermochelys: ["Dermochelys"],
                    },
                    Trionychidae: {
                        Pelochelys: ["Pelochelys"],
                        Dogania: ["Dogania"],
                    },
                },
                Crocodylia: {
                    Crocodylidae: {
                        Crocodylus: ["Crocodylus"],
                    },
                },
            },

            Aves: {
                Passeriformes: {
                    Eurylaimidae: {
                        Eurylaimus: ["Eurylaimus"],
                        Cymbirhynchus: ["Cymbirhynchus"],
                    },
                    Pittidae: {
                        Pitta: ["Pitta"],
                    },
                    Muscicapidae: {
                        Ficedula: ["Ficedula"],
                        Copsychus: ["Copsychus"],
                    },
                    Pycnonotidae: {
                        Pycnonotus: ["Pycnonotus"],
                        Alophoixus: ["Alophoixus"],
                    },
                    Nectariniidae: {
                        Arachnothera: ["Arachnothera"],
                        Cinnyris: ["Cinnyris"],
                    },
                    Timaliidae: {
                        Garrulax: ["Garrulax"],
                        Stachyris: ["Stachyris"],
                    },
                },
                Bucerotiformes: {
                    Bucerotidae: {
                        Buceros: ["Buceros"],
                        Anthracoceros: ["Anthracoceros"],
                        Rhinoplax: ["Rhinoplax"],
                    },
                },
                Psittaciformes: {
                    Psittaculidae: {
                        Psittacula: ["Psittacula"],
                        Loriculus: ["Loriculus"],
                    },
                },
                Piciformes: {
                    Picidae: {
                        Dinopium: ["Dinopium"],
                        Picus: ["Picus"],
                    },
                },
                Accipitriformes: {
                    Accipitridae: {
                        Haliaeetus: ["Haliaeetus"],
                        Spilornis: ["Spilornis"],
                        Ictinaetus: ["Ictinaetus"],
                    },
                },
                Strigiformes: {
                    Strigidae: {
                        Ninox: ["Ninox"],
                    },
                    Tytonidae: {
                        Tyto: ["Tyto"],
                    },
                },
                Galliformes: {
                    Phasianidae: {
                        Lophura: ["Lophura"],
                        Polyplectron: ["Polyplectron"],
                    },
                },
                Coraciiformes: {
                    Alcedinidae: {
                        Alcedo: ["Alcedo"],
                        Halcyon: ["Halcyon"],
                    },
                },
            },
        },

        Arthropoda: {
            Insecta: {
                Lepidoptera: {
                    Saturniidae: {
                        Attacus: ["Attacus"],
                        Samia: ["Samia"],
                    },
                    Nymphalidae: {
                        Idea: ["Idea"],
                        Trogonoptera: ["Trogonoptera"],
                    },
                    Papilionidae: {
                        Troides: ["Troides"],
                        Papilio: ["Papilio"],
                    },
                    Pieridae: {
                        Delias: ["Delias"],
                    },
                    Sphingidae: {
                        Atlas: ["Atlas"],
                        Daphnis: ["Daphnis"],
                    },
                },
                Hymenoptera: {
                    Apidae: {
                        Apis: ["Apis"],
                        Xylocopa: ["Xylocopa"],
                    },
                    Vespidae: {
                        Vespa: ["Vespa"],
                        Ropalidia: ["Ropalidia"],
                    },
                },
                Coleoptera: {
                    Scarabaeidae: {
                        Chalcosoma: ["Chalcosoma"],
                        Oryctes: ["Oryctes"],
                    },
                    Lucanidae: {
                        Odontolabis: ["Odontolabis"],
                    },
                },
                Odonata: {
                    Libellulidae: {
                        Orthetrum: ["Orthetrum"],
                        Neurothemis: ["Neurothemis"],
                    },
                },
                Orthoptera: {
                    Tettigoniidae: {
                        Mecopoda: ["Mecopoda"],
                    },
                },
            },
            Arachnida: {
                Araneae: {
                    Theraphosidae: {
                        Cyriopagopus: ["Cyriopagopus"],
                    },
                    Salticidae: {
                        Cosmophasis: ["Cosmophasis"],
                    },
                },
                Scorpiones: {
                    Scorpionidae: {
                        Heterometrus: ["Heterometrus"],
                    },
                },
            },
            Malacostraca: {
                Decapoda: {
                    Gecarcinidae: {
                        Gecarcoidea: ["Gecarcoidea"],
                    },
                    Portunidae: {
                        Scylla: ["Scylla"],
                    },
                },
            },
        },

        Mollusca: {
            Gastropoda: {
                Stylommatophora: {
                    Achatinidae: {
                        Achatina: ["Achatina"],
                    },
                },
            },
            Bivalvia: {
                Venerida: {
                    Unionidae: {
                        Pilsbryoconcha: ["Pilsbryoconcha"],
                    },
                },
            },
        }
    },

    Plantae: {
        Tracheophyta: {
            Magnoliopsida: {
                Malpighiales: {
                    Rafflesiaceae: {
                        Rafflesia: ["Rafflesia"],
                    },
                    Euphorbiaceae: {
                        Hevea: ["Hevea"],
                        Euphorbia: ["Euphorbia"],
                    },
                },
                Fabales: {
                    Fabaceae: {
                        Acacia: ["Acacia"],
                        Albizia: ["Albizia"],
                        Dalbergia: ["Dalbergia"],
                    },
                },
                Sapindales: {
                    Anacardiaceae: {
                        Mangifera: ["Mangifera"],
                    },
                    Meliaceae: {
                        Aquilaria: ["Aquilaria"],
                        Dysoxylum: ["Dysoxylum"],
                    },
                },
                Myrtales: {
                    Myrtaceae: {
                        Syzygium: ["Syzygium"],
                    },
                },
                Laurales: {
                    Lauraceae: {
                        Cinnamomum: ["Cinnamomum"],
                        Litsea: ["Litsea"],
                    },
                },
                Ericales: {
                    Nepenthaceae: {
                        Nepenthes: ["Nepenthes"],
                    },
                },
            },
            Liliopsida: {
                Arecales: {
                    Arecaceae: {
                        Elaeis: ["Elaeis"],
                        Calamus: ["Calamus"],
                        Nypa: ["Nypa"],
                    },
                },
                Poales: {
                    Poaceae: {
                        Bambusa: ["Bambusa"],
                        Gigantochloa: ["Gigantochloa"],
                    },
                },
                Zingiberales: {
                    Zingiberaceae: {
                        Zingiber: ["Zingiber"],
                        Etlingera: ["Etlingera"],
                    },
                },
            },
        },
        Polypodiopsida: {
            Polypodiales: {
                Polypodiaceae: {
                    Platycerium: ["Platycerium"],
                },
            },
        },
    },

    Fungi: {
        Agaricomycetes: {
            Agaricales: {
                Agaricaceae: {
                    Agaricus: ["Agaricus"],
                },
                Amanitaceae: {
                    Amanita: ["Amanita"],
                },
                Marasmiaceae: {
                    Marasmius: ["Marasmius"],
                },
            },
            Polyporales: {
                Polyporaceae: {
                    Polyporus: ["Polyporus"],
                    Trametes: ["Trametes"],
                },
                Ganodermataceae: {
                    Ganoderma: ["Ganoderma"],
                },
            },
        },
        Ascomycetes: {
            Pezizales: {
                Morchellaceae: {
                    Morchella: ["Morchella"],
                },
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
        console.log("EDIT DATA:", initialData);

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
            interestingFacts: Array.isArray(initialData.interestingFacts)
                ? initialData.interestingFacts.join("\n")
                : initialData.interestingFacts || "",
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

        if (formData.description.length > 300) {
            setError("Description must not exceed 300 characters.");
            return;
        }

        const facts = formData.interestingFacts
            .split("\n")
            .map((fact) => fact.trim())
            .filter((fact) => fact !== "");

        if (facts.length > 5) {
            setError("You can enter a maximum of 5 interesting facts.");
            return;
        }

        if (facts.some((fact) => fact.length > 150)) {
            setError("Each interesting fact must not exceed 150 characters.");
            return;
        }

        const data = {
            ...formData,
            interestingFacts: facts,
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
    const DEFAULT_IMAGE = "/images/image-coming-soon.png";
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

                        <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="e.g African elephant" required />
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

                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} maxLength={300} placeholder="Describe this species..." required />

                    <p className="character-count">{formData.description.length}/300 characters</p>
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

                <div className="form-group">
                    <label>Image Preview</label>

                    <div className="detail-image">
                        <img
                            src={formData.imageUrl || DEFAULT_IMAGE}
                            alt="Preview"
                            onError={(event) => {
                                event.currentTarget.src = DEFAULT_IMAGE;
                            }}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="interestingFacts">Interesting Facts</label>

                    <textarea id="interestingFacts" name="interestingFacts" value={formData.interestingFacts} onChange={handleChange} maxLength={750} placeholder={"Enter one fact per line.\nExample: Can swim long distances.\nExample: Mainly active at night."} />

                    <p className="character-count">{formData.interestingFacts.length}/750 characters</p>

                    <small>Enter up to 5 facts, one fact per line.</small>
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

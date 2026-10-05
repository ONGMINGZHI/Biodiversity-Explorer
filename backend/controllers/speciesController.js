const Species = require("../models/Species");
const ConservationStatus = require("../models/ConservationStatus");

// GET /species
const getSpecies = async (req, res) => {
    try {
        const { search, kingdom, conservationStatus, className, order, family, region } = req.query;

        const filter = {};

        // Search by common name or scientific name
        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    scientificName: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        // Kingdom filter
        if (kingdom && kingdom !== "All") {
            filter.kingdom = kingdom;
        }

        // Conservation status filter
        if (conservationStatus && conservationStatus !== "All") {
            const matchingStatus = await ConservationStatus.findOne({
                name: {
                    $regex: `^${conservationStatus}$`,
                    $options: "i",
                },
            });

            if (matchingStatus) {
                filter.conservationStatus = matchingStatus._id;
            } else {
                return res.json([]);
            }
        }

        // Other taxonomy filters
        if (className && className !== "All") {
            filter.className = className;
        }

        if (order && order !== "All") {
            filter.order = order;
        }

        if (family && family !== "All") {
            filter.family = family;
        }

        // Region filter
        if (region && region !== "All") {
            filter.region = region;
        }

        const species = await Species.find(filter).populate("habitat").populate("conservationStatus").sort({ name: 1 });

        res.json(species);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch species.",
            error: error.message,
        });
    }
};

// GET /species/:id
const getSpeciesById = async (req, res) => {
    try {
        const species = await Species.findById(req.params.id).populate("habitat").populate("conservationStatus");

        if (!species) {
            return res.status(404).json({
                message: "Species not found.",
            });
        }

        res.json(species);
    } catch (error) {
        res.status(400).json({
            message: "Invalid species ID.",
            error: error.message,
        });
    }
};

// POST /species
const createSpecies = async (req, res) => {
    try {
        const speciesData = req.body;

        // Support creating multiple species at once
        if (Array.isArray(speciesData)) {
            // Check duplicate scientific names
            for (const item of speciesData) {
                const existingSpecies = await Species.findOne({
                    scientificName: item.scientificName,
                });

                if (existingSpecies) {
                    return res.status(400).json({
                        message: `Species already exists: ${item.scientificName}`,
                    });
                }
            }

            const species = await Species.create(speciesData);

            return res.status(201).json({
                message: "Species created successfully.",
                species,
            });
        }

        // Check duplicate scientific name
        const existingScientificName = await Species.findOne({
            scientificName: speciesData.scientificName,
        });

        if (existingScientificName) {
            return res.status(400).json({
                message: `Species already exists: ${speciesData.scientificName}`,
            });
        }

        const existingName = await Species.findOne({
            name: speciesData.name,
        });

        if (existingName) {
            return res.status(400).json({
                message: `A species with the name "${speciesData.name}" already exists.`,
            });
        }
        const species = await Species.create(speciesData);

        res.status(201).json({
            message: "Species created successfully.",
            species,
        });
    } catch (error) {
        // Duplicate scientificName
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];

            if (duplicateField === "name") {
                return res.status(400).json({
                    message: "A species with this common name already exists.",
                });
            }

            if (duplicateField === "scientificName") {
                return res.status(400).json({
                    message: "A species with this scientific name already exists.",
                });
            }

            return res.status(400).json({
                message: "A species with this information already exists.",
            });
        }
    }
};

// PATCH /species/:id
const updateSpecies = async (req, res) => {
    try {
        const existingSpecies = await Species.findOne({
            scientificName: req.body.scientificName,
            _id: { $ne: req.params.id },
        });

        if (existingSpecies) {
            return res.status(400).json({
                message: `Species already exists: ${req.body.scientificName}`,
            });
        }

        const species = await Species.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate("habitat")
            .populate("conservationStatus");

        if (!species) {
            return res.status(404).json({
                message: "Species not found.",
            });
        }

        res.json({
            message: "Species updated successfully.",
            species,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Species scientific name already exists.",
            });
        }

        res.status(400).json({
            message: "Failed to update species.",
            error: error.message,
        });
    }
};

// DELETE /species/:id
const deleteSpecies = async (req, res) => {
    try {
        const species = await Species.findByIdAndDelete(req.params.id);

        if (!species) {
            return res.status(404).json({
                message: "Species not found.",
            });
        }

        res.json({
            message: "Species deleted successfully.",
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete species.",
            error: error.message,
        });
    }
};

module.exports = {
    getSpecies,
    getSpeciesById,
    createSpecies,
    updateSpecies,
    deleteSpecies,
};

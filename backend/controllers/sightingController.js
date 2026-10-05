const Sighting = require("../models/Sighting");
const Species = require("../models/Species");

// GET /sightings
const getSightings = async (req, res) => {
    try {
        const { search } = req.query;

        const filter = {};

        // Search by species name or scientific name
        if (search) {
            const matchingSpecies = await Species.find({
                $or: [
                    {
                        name: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        scientificName: {
                            $regex: search,
                            $options: "i"
                        }
                    }
                ]
            }).select("_id");

            filter.species = {
                $in: matchingSpecies.map(species => species._id)
            };
        }

        const sightings = await Sighting.find(filter)
            .populate("species")
            .populate("location")
            .sort({ date: -1 });

        res.json(sightings);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch sightings.",
            error: error.message
        });
    }
};

// GET /sightings/:id
const getSightingById = async (req, res) => {
    try {
        const sighting = await Sighting.findById(req.params.id)
            .populate("species")
            .populate("location");

        if (!sighting) {
            return res.status(404).json({
                message: "Sighting not found."
            });
        }

        res.json(sighting);
    } catch (error) {
        res.status(400).json({
            message: "Invalid sighting ID.",
            error: error.message
        });
    }
};

// POST /sightings
const createSighting = async (req, res) => {
    try {
        const sightings = await Sighting.create(req.body);

        // Multiple sightings
        if (Array.isArray(sightings)) {
            const populatedSightings = await Sighting.find({
                _id: {
                    $in: sightings.map((sighting) => sighting._id),
                },
            })
                .populate("species")
                .populate("location");

            return res.status(201).json({
                message: "Sightings created successfully.",
                sightings: populatedSightings,
            });
        }

        // Single sighting
        const populatedSighting = await sightings.populate(["species", "location"]);

        res.status(201).json({
            message: "Sighting created successfully.",
            sighting: populatedSighting,
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create sighting.",
            error: error.message,
        });
    }
};

// PATCH /sightings/:id
const updateSighting = async (req, res) => {
    try {
        const sighting = await Sighting.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate("species")
            .populate("location");

        if (!sighting) {
            return res.status(404).json({
                message: "Sighting not found.",
            });
        }

        res.json({
            message: "Sighting updated successfully.",
            sighting,
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update sighting.",
            error: error.message,
        });
    }
};

// DELETE /sightings/:id
const deleteSighting = async (req, res) => {
    try {
        const sighting = await Sighting.findByIdAndDelete(req.params.id);

        if (!sighting) {
            return res.status(404).json({
                message: "Sighting not found.",
            });
        }

        res.json({
            message: "Sighting deleted successfully.",
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete sighting.",
            error: error.message,
        });
    }
};

module.exports = {
    getSightings,
    getSightingById,
    createSighting,
    updateSighting,
    deleteSighting,
};

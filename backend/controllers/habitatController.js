const Habitat = require("../models/Habitat");


const getHabitats = async (req, res) => {
    try {
        const habitats = await Habitat.find();

        res.json(habitats);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch habitats.",
            error: error.message
        });
    }
};


const getHabitatById = async (req, res) => {
    try {
        const habitat = await Habitat.findById(req.params.id);

        if (!habitat) {
            return res.status(404).json({
                message: "Habitat not found."
            });
        }

        res.json(habitat);

    } catch (error) {
        res.status(400).json({
            message: "Invalid habitat ID.",
            error: error.message
        });
    }
};


const createHabitat = async (req, res) => {
    try {
        const habitat = await Habitat.create(req.body);

        res.status(201).json({
            message: "Habitat created successfully.",
            habitat
        });

    } catch (error) {

        // Duplicate habitat name
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Habitat already exists."
            });
        }

        res.status(400).json({
            message: "Failed to create habitat.",
            error: error.message
        });
    }
};


const updateHabitat = async (req, res) => {
    try {
        const habitat = await Habitat.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!habitat) {
            return res.status(404).json({
                message: "Habitat not found."
            });
        }

        res.json({
            message: "Habitat updated successfully.",
            habitat
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Habitat name already exists."
            });
        }

        res.status(400).json({
            message: "Failed to update habitat.",
            error: error.message
        });
    }
};


const deleteHabitat = async (req, res) => {
    try {
        const habitat = await Habitat.findByIdAndDelete(
            req.params.id
        );

        if (!habitat) {
            return res.status(404).json({
                message: "Habitat not found."
            });
        }

        res.json({
            message: "Habitat deleted successfully."
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to delete habitat.",
            error: error.message
        });
    }
};


module.exports = {
    getHabitats,
    getHabitatById,
    createHabitat,
    updateHabitat,
    deleteHabitat
};

const ConservationStatus = require("../models/ConservationStatus");


const getConservationStatuses = async (req, res) => {
    try {
        const statuses = await ConservationStatus.find();

        res.json(statuses);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch conservation statuses.",
            error: error.message
        });
    }
};


const getConservationStatusById = async (req, res) => {
    try {
        const status = await ConservationStatus.findById(req.params.id);

        if (!status) {
            return res.status(404).json({
                message: "Conservation status not found."
            });
        }

        res.json(status);

    } catch (error) {
        res.status(400).json({
            message: "Invalid conservation status ID.",
            error: error.message
        });
    }
};


const createConservationStatus = async (req, res) => {
    try {
        const status = await ConservationStatus.create(req.body);

        res.status(201).json({
            message: "Conservation status created successfully.",
            status
        });

    } catch (error) {

        // Duplicate conservation status name
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Conservation status already exists."
            });
        }

        res.status(400).json({
            message: "Failed to create conservation status.",
            error: error.message
        });
    }
};


const updateConservationStatus = async (req, res) => {
    try {
        const status = await ConservationStatus.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!status) {
            return res.status(404).json({
                message: "Conservation status not found."
            });
        }

        res.json({
            message: "Conservation status updated successfully.",
            status
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Conservation status name already exists."
            });
        }

        res.status(400).json({
            message: "Failed to update conservation status.",
            error: error.message
        });
    }
};


const deleteConservationStatus = async (req, res) => {
    try {
        const status = await ConservationStatus.findByIdAndDelete(
            req.params.id
        );

        if (!status) {
            return res.status(404).json({
                message: "Conservation status not found."
            });
        }

        res.json({
            message: "Conservation status deleted successfully."
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to delete conservation status.",
            error: error.message
        });
    }
};


module.exports = {
    getConservationStatuses,
    getConservationStatusById,
    createConservationStatus,
    updateConservationStatus,
    deleteConservationStatus
};

const Location = require("../models/Location");


const getLocations = async (req, res) => {
    try {
        const { state } = req.query;
        const filter = {};

        if (state && state !== "All") {
            filter.state = state;
        }

        const locations = await Location.find(filter).sort({ name: 1 });

        res.json(locations);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch locations.",
            error: error.message
        });
    }
};


const getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);

        if (!location) {
            return res.status(404).json({
                message: "Location not found."
            });
        }

        res.json(location);

    } catch (error) {
        res.status(400).json({
            message: "Invalid location ID.",
            error: error.message
        });
    }
};


const createLocation = async (req, res) => {
    try {
        const location = await Location.create(req.body);

        res.status(201).json({
            message: "Location created successfully.",
            location
        });

    } catch (error) {

        // Duplicate location name
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Location already exists."
            });
        }

        res.status(400).json({
            message: "Failed to create location.",
            error: error.message
        });
    }
};


const updateLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!location) {
            return res.status(404).json({
                message: "Location not found."
            });
        }

        res.json({
            message: "Location updated successfully.",
            location
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Location name already exists."
            });
        }

        res.status(400).json({
            message: "Failed to update location.",
            error: error.message
        });
    }
};


const deleteLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(
            req.params.id
        );

        if (!location) {
            return res.status(404).json({
                message: "Location not found."
            });
        }

        res.json({
            message: "Location deleted successfully."
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to delete location.",
            error: error.message
        });
    }
};


module.exports = {
    getLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation
};

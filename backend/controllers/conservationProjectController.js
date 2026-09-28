const ConservationProject = require("../models/ConservationProject");


const getConservationProjects = async (req, res) => {
    try {
        const { search, status } = req.query;

        const filter = {};

        // Search by project name or organisation
        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    organisation: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // Filter by status
        if (status && status !== "All") {
            filter.status = status;
        }

        const projects = await ConservationProject.find(filter)
            .populate("species")
            .sort({ createdAt: -1 });

        res.json(projects);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch conservation projects.",
            error: error.message
        });
    }
};


const getConservationProjectById = async (req, res) => {
    try {
        const project = await ConservationProject.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Conservation project not found."
            });
        }

        res.json(project);

    } catch (error) {
        res.status(400).json({
            message: "Invalid conservation project ID.",
            error: error.message
        });
    }
};


const createConservationProject = async (req, res) => {
    try {
        const project = await ConservationProject.create(req.body);

        res.status(201).json({
            message: "Conservation Project created successfully.",
            project
        });

    } catch (error) {

        // Duplicate project name
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Conservation project already exists."
            });
        }

        res.status(400).json({
            message: "Failed to create conservation Project.",
            error: error.message
        });
    }
};


const updateConservationProject = async (req, res) => {
    try {
        const project = await ConservationProject.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!project) {
            return res.status(404).json({
                message: "Conservation project not found."
            });
        }

        res.json({
            message: "Conservation Project updated successfully.",
            project
        });

    } catch (error) {

        // Duplicate project name
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Conservation project name already exists."
            });
        }

        res.status(400).json({
            message: "Failed to update conservation Project.",
            error: error.message
        });
    }
};


const deleteConservationProject = async (req, res) => {
    try {
        const project = await ConservationProject.findByIdAndDelete(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                message: "Conservation project not found."
            });
        }

        res.json({
            message: "Conservation Project deleted successfully."
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to delete conservation Project.",
            error: error.message
        });
    }
};


module.exports = {
    getConservationProjects,
    getConservationProjectById,
    createConservationProject,
    updateConservationProject,
    deleteConservationProject
};

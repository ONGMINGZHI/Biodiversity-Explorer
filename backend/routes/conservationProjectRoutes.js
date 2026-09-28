const express = require("express");

const {
    getConservationProjects,
    getConservationProjectById,
    createConservationProject,
    updateConservationProject,
    deleteConservationProject
} = require("../controllers/conservationProjectController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getConservationProjects);

router.get("/:id", getConservationProjectById);

router.post("/", protect, adminOnly, createConservationProject);

router.patch("/:id", protect, adminOnly, updateConservationProject);

router.delete("/:id", protect, adminOnly, deleteConservationProject);

module.exports = router;
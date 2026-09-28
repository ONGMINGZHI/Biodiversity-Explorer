const express = require("express");

const {
    getSpecies,
    getSpeciesById,
    createSpecies,
    updateSpecies,
    deleteSpecies
} = require("../controllers/speciesController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getSpecies);

router.get("/:id", getSpeciesById);

router.post("/", protect, adminOnly, createSpecies);

router.patch("/:id", protect, adminOnly, updateSpecies);

router.delete("/:id", protect, adminOnly, deleteSpecies);

module.exports = router;
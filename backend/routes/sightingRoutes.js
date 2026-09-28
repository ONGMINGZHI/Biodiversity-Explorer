const express = require("express");

const {
    getSightings,
    getSightingById,
    createSighting,
    updateSighting,
    deleteSighting
} = require("../controllers/sightingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getSightings);

router.get("/:id", getSightingById);

router.post("/", protect, adminOnly, createSighting);

router.patch("/:id", protect, adminOnly, updateSighting);

router.delete("/:id", protect, adminOnly, deleteSighting);

module.exports = router;
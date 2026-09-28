const express = require("express");

const {
    getHabitats,
    getHabitatById,
    createHabitat,
    updateHabitat,
    deleteHabitat
} = require("../controllers/habitatController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getHabitats);

router.get("/:id", getHabitatById);

router.post("/", protect, adminOnly, createHabitat);

router.patch("/:id", protect, adminOnly, updateHabitat);

router.delete("/:id", protect, adminOnly, deleteHabitat);
module.exports = router;

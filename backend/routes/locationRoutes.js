const express = require("express");

const {
    getLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation
} = require("../controllers/locationController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getLocations);

router.get("/:id", getLocationById);


router.post("/", protect, adminOnly, createLocation);

router.patch("/:id", protect, adminOnly, updateLocation);

router.delete("/:id", protect, adminOnly, deleteLocation);
module.exports = router;
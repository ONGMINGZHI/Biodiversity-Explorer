const express = require("express");

const {
    getConservationStatuses,
    getConservationStatusById,
    createConservationStatus,
    updateConservationStatus,
    deleteConservationStatus
} = require("../controllers/conservationStatusController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getConservationStatuses);

router.get("/:id", getConservationStatusById);

router.post("/", protect, adminOnly, createConservationStatus);

router.patch("/:id", protect, adminOnly, updateConservationStatus);

router.delete("/:id", protect, adminOnly, deleteConservationStatus);

module.exports = router;
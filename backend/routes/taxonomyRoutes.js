
const express = require("express");
const router = express.Router();

const {
    getTaxonomies,
    getTaxonomyById,
    createTaxonomy,
    updateTaxonomy,
    deleteTaxonomy,
} = require("../controllers/taxonomyController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getTaxonomies);
router.get("/:id", getTaxonomyById);

// Admin-only routes
router.post("/", protect, createTaxonomy);
router.patch("/:id", protect, adminOnly, updateTaxonomy);
router.delete("/:id", protect, adminOnly, deleteTaxonomy);

module.exports = router;

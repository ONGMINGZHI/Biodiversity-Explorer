
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

router.get("/", getTaxonomies);

router.get("/:id", getTaxonomyById);

router.post("/", protect, createTaxonomy);

router.patch("/:id", protect, adminOnly, updateTaxonomy);

router.delete("/:id", protect, adminOnly, deleteTaxonomy);

module.exports = router;
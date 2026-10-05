const mongoose = require("mongoose");

const speciesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    scientificName: {
        type: String,
        required: true,
        unique: true,
    },

    // Taxonomic classification
    kingdom: {
        type: String,
        required: true,
    },

    phylum: {
        type: String,
        required: true,
    },

    className: {
        type: String,
        required: true,
    },

    order: {
        type: String,
        required: true,
    },

    family: {
        type: String,
        required: true,
    },

    genus: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
        maxlength: 300
    },

    habitat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habitat",
        required: true,
    },

    region: {
        type: String,
        required: true,
    },

    conservationStatus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ConservationStatus",
        required: true,
    },

    imageUrl: {
        type: String,
        default: "https://placehold.co/600x400/png?text=Photo+Coming+Soon",
    },

    imageCredit: {
        type: String,
    },

    imageSource: {
        type: String,
    },

    imageLicense: {
        type: String,
    },

    interestingFacts: {
        type: [String],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Species", speciesSchema);
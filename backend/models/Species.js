const mongoose = require("mongoose");

const speciesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    scientificName: {
        type: String,
        required: true,
        unique: true,
    },

    category: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    habitat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habitat",
        // so objectId refers to a document in the Habitat model
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

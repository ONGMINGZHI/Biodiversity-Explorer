const mongoose = require("mongoose");

const sightingSchema = new mongoose.Schema({
    species: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Species",
        required: true
    },

    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    numberObserved: {
        type: Number,
        required: true
    },

    notes: {
        type: String
    },

    imageUrl: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Sighting", sightingSchema);
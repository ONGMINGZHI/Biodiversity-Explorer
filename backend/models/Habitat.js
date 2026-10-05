const mongoose = require("mongoose");

const habitatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    description: {
        type: String,
        required: true,
        maxlength: 300
    },

    region: {
        type: String,
    },

    imageUrl: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Habitat", habitatSchema);

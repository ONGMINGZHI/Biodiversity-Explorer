const mongoose = require("mongoose");

const conservationStatusSchema = new mongoose.Schema({
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

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("ConservationStatus", conservationStatusSchema);

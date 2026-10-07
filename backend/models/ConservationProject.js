const mongoose = require("mongoose");

const conservationProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true,
        maxlength: 300
    },

    organisation: {
        type: String,
        required: true,
    },

    startDate: {
        type: Date,
        required: true,
    },

    endDate: {
        type: Date,
    },

    status: {
        type: String,
        required: true,
    },

    species: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Species",
        },
    ],

    imageUrl: {
        type: String,
    },
    projectUrl: {
    type: String,
    trim:true
},

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("ConservationProject", conservationProjectSchema);

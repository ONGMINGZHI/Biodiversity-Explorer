
const mongoose = require("mongoose");

const taxonomySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Taxonomy name is required."],
        trim: true,
    },
    rank: {
        type: String,
        required: [true, "Taxonomy rank is required."],
        enum: ["kingdom", "phylum", "class", "order", "family", "genus"],
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Taxonomy",
        default: null,
    },
}, { timestamps: true });

taxonomySchema.index({ rank: 1, parent: 1, name: 1 });

module.exports = mongoose.model("Taxonomy", taxonomySchema);

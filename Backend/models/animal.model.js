const mongoose = require("mongoose");

const animalSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String },
    ready: { type: Boolean, default: false },
    type: { type: String },
    afflictions: [
        { type: String },
    ],
    address: { type: String },
    city: { type: String },
    isAdopted: {type: Boolean, default: false },
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "NGO" },
    appliers: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ]
});

module.exports = mongoose.model("Animal", animalSchema);
const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    city: { type: String },
    address: { type: String },
    coordinates: { 
        lat: {type: String},
        lng: {type: String}
     },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: "NGO"},
    isChecked: { type: Boolean },
    wasRescued: { type: Boolean },
    notes: {type: String}
});

module.exports = mongoose.model("Report", reportSchema);
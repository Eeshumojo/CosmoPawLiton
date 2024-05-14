const mongoose = require("mongoose");

const ngoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String },
    email: { type: String },
    description: { type: String },
    password: { type: String },
    address: { type: String },
    city: { type: String },
    website: { type: String},
});

module.exports = mongoose.model("NGO", ngoSchema);
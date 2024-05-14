const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String },
    email: { type: String },
    phone: { type: Number },
    password: { type: String },
    address: { type: String },
    city: { type: String },
    wantToAdopt: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Animal" }
    ]
});

module.exports = mongoose.model("User", userSchema);
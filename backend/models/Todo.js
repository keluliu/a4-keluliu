const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, default: "Upcoming" },
    creationDate: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Link task to user
});

module.exports = mongoose.model("Todo", TodoSchema);
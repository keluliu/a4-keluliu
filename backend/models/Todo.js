const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, default: "Upcoming" },
    creationDate: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link task to user
    category: { type: String, enum: ["Work", "Personal", "Academic", "Travel", "Other"], default: "Other" } // Task category
});

module.exports = mongoose.model("Todo", TodoSchema);
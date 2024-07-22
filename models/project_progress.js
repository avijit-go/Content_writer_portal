const mongoose = require("mongoose");
const Project = require("./project");

const projectProgressSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Project,
        required: [true, 'Please provide a valid Project']
    },
    progress: {
        type: Number
    },
    note: {
        type: String,
    }
}, { timestamps: true });

const ProjectProgress = new mongoose.model("project_progress", projectProgressSchema);

module.exports = ProjectProgress;

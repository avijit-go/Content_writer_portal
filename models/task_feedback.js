const mongoose = require("mongoose");
const TeamMember = require("./team_member");
const Task = require("./task");

const taskFeedbackSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Task,
        required: [true, 'Please provide a valid Task']
    },
    teamMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: TeamMember,
        required: [true, 'Please provide a valid user']
    },
    feedback: {
        type: String,
        required: true
    }
}, { timestamps: true });

const TaskFeedback = new mongoose.model("task_feedbacks", taskFeedbackSchema);

module.exports = TaskFeedback;

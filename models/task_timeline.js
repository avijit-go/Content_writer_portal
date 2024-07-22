const mongoose = require("mongoose");
const Task = require("./task");

const taskTimelineSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Task,
        required: [true, 'Please provide a valid Task']
    },
    comment: {
        type: String,
        required: true
    },
}, { timestamps: true });

const TaskTimeline = new mongoose.model("task_timeliines", taskTimelineSchema);

module.exports = TaskTimeline;

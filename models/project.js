const mongoose = require("mongoose");
const Client = require("./client");

const projectSchema = new mongoose.Schema({
	name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Client,
        required: [true, 'Please provide a valid client']
    },
    credentials: {
        type: String
    },
    completed: {
        type: Boolean
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const Project = new mongoose.model("projects", projectSchema);

module.exports = Project;

const mongoose = require("mongoose");
const Client = require("./client");
const Project = require("./project");

const CampaignSchema = new mongoose.Schema({
	name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Project,
        required: [true, 'Please provide a valid project']
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Client,
        required: [true, 'Please provide a valid client']
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
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

const Campaign = new mongoose.model("campaigns", CampaignSchema);

module.exports = Campaign;

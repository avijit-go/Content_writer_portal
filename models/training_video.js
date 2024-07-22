const mongoose = require("mongoose");

const trainingVideoSchema = new mongoose.Schema({
	name: {
        type: String,
        required: true
    },
	description: {
        type: String,
        required: true
    },
	thumbnail_image: {
        type: String
    },
	video: {
        type: Array
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

const trainingVideo = new mongoose.model("training_videos", trainingVideoSchema);

module.exports = trainingVideo;

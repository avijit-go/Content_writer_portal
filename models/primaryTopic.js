const mongoose = require("mongoose");

const primaryTopicSchema = new mongoose.Schema({
	name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    }
});

const PrimaryTopic = new mongoose.model("primaryTopics", primaryTopicSchema);

module.exports = PrimaryTopic;

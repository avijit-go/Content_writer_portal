const mongoose = require("mongoose");

const contentTypeSchema = new mongoose.Schema({
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

const ContentType = new mongoose.model("contentTypes", contentTypeSchema);

module.exports = ContentType;

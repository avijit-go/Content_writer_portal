const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
	name: {
        type: String,
        required: true
    },
    aboutUs: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

const setting = new mongoose.model("settings", settingSchema);

module.exports = setting;

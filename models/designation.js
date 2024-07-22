const mongoose = require("mongoose");

const DesignationSchema = new mongoose.Schema({
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

const Designation = new mongoose.model("designations", DesignationSchema);

module.exports = Designation;

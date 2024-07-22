const mongoose = require("mongoose");
const Designation = require("./designation");
const bycrpt = require("bcryptjs");

const teamMemberSchema = new mongoose.Schema({
	firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
		type: String,
		required: true,
		// select: false
	},
	confirmPassword: String,
    image: {
        type: String,
    },
    address: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    pin: {
        type: Number,
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ["male", "female", "trans"],
        required: true
    },
    designation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Designation,
        required: [true, 'Please provide a valid Designation']
    },
    reportingTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Designation,
    },
    type: {
        type: String,
        enum: ["full time", "part time", "freelancer"],
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    salaryExpiry: {
        type: Date,
    },
	joiningDate: {
		type: Date,
	},
    emailOtp: {
        type: Number,
        default: 1234
    },
    mobileOtp: {
        type: Number,
        default: 4321
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

teamMemberSchema.pre("save", async function(next) {
	if(this.isModified("password")) {
		this.password = await bycrpt.hash(this.password, 10);
		this.confirmPassword = undefined;
	}
	next();
})

teamMemberSchema.pre("updateOne", async function(next) {
	try {
		if(this._update.password) {
			this._update.password = await bycrpt.hash(this._update.password, 10);
		}
		next();
	} catch (err) {
		return next(err);
	}
})

teamMemberSchema.pre("findOneAndUpdate", async function(next) {
	try {
		if(this._update.password) {
			this._update.password = await bycrpt.hash(this._update.password, 10);
		}
		next();
	} catch (err) {
		return next(err);
	}
})

const teamMember = new mongoose.model("team_members", teamMemberSchema);

module.exports = teamMember;

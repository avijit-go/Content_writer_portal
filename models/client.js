const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");

const clientSchema = new mongoose.Schema({
	name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    competitors: {
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
		required: true
	},
    confirmPassword: String,
    website: {
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
    jobTitle: {
        type: String,
    },
    timeZone: {
        type: String,
    },
    gst: {
        type: String,
    },
    currency: {
        type: String,
    },
    currencySymbol: {
        type: String,
    },
    startDate: {
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
    },
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

clientSchema.pre("save", async function(next) {
	if(this.isModified("password")) {
		this.password = await bycrpt.hash(this.password, 10);
		this.confirmPassword = undefined;
	}
	next();
})

clientSchema.pre("updateOne", async function(next) {
	try {
		if(this._update.password) {
			this._update.password = await bycrpt.hash(this._update.password, 10);
		}
		next();
	} catch (err) {
		return next(err);
	}
})

clientSchema.pre("findOneAndUpdate", async function(next) {
	try {
		if(this._update.password) {
			this._update.password = await bycrpt.hash(this._update.password, 10);
		}
		next();
	} catch (err) {
		return next(err);
	}
})

const client = new mongoose.model("clients", clientSchema);

module.exports = client;

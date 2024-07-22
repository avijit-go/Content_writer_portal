const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		// select: false
	},
	confirmPassword: String,
	phone: Number,
	address: String,
    country: String,
    state: String,
    pin: Number,
	status: {
		type: Boolean,
		default: true
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

adminSchema.pre("save", async function(next) {
	if(this.isModified("password")) {
		this.password = await bycrpt.hash(this.password, 10);
		this.confirmPassword = undefined;
	}
	next();
})

adminSchema.pre("updateOne", async function(next) {
	try {
		if(this._update.password) {
			this._update.password = await bycrpt.hash(this._update.password, 10);
		}
		next();
	} catch (err) {
		return next(err);
	}
})

adminSchema.pre("findOneAndUpdate", async function(next) {
	try {
		if(this._update.password) {
			this._update.password = await bycrpt.hash(this._update.password, 10);
		}
		next();
	} catch (err) {
		return next(err);
	}
})

const Admin = new mongoose.model("admin", adminSchema);

module.exports = Admin;

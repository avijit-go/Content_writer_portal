const express = require("express");
const Settings = require("../models/settings");
const SettingsRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");


SettingsRoute.post("/create", async (req, res) => {
	try {
        const SettingsData = new Settings(req.body);
        const result = await SettingsData.save();
        message = {
            error: false,
            message: "Settings Added Successfully!",
            data: result,
        };
        res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: err,
		};
		res.status(200).send(message);
	}
});

SettingsRoute.get("/detail/:SettingsId", async (req, res) => {
	try {
		const SettingsData = await Settings.findOne({ _id: req.params.SettingsId });
		if (SettingsData.length != 0) {
			message = {
				error: false,
				message: "Settings Data Found!",
				data: SettingsData,
			};
		} else {
			message = {
				error: true,
				message: "No Data Found!",
			};
		}
		res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "Settings not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

SettingsRoute.patch("/update/:SettingsId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await Settings.updateOne({ _id: req.params.SettingsId }, req.body);
		message = {
			error: false,
			message: "Settings Updated Successfully!"
		};
		res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: err,
		};
		res.status(200).send(message);
	}
});


module.exports = SettingsRoute;
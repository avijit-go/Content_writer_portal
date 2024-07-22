const express = require("express");
const PrimaryTopic = require("../models/primaryTopic");
const PrimaryTopicRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");


PrimaryTopicRoute.get("/list", async (req, res) => {
    try {
        const PrimaryTopicList = await PrimaryTopic.find({});
        message = {
            error: false,
            message: "PrimaryTopic list",
            data: PrimaryTopicList,
        };
        res.status(200).send(message);
    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err,
        };
        res.status(200).send(message);
    }
});

PrimaryTopicRoute.post("/create", async (req, res) => {
	try {
        const PrimaryTopicData = new PrimaryTopic(req.body);
        const result = await PrimaryTopicData.save();
        message = {
            error: false,
            message: "PrimaryTopic Added Successfully!",
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

PrimaryTopicRoute.get("/detail/:PrimaryTopicId", async (req, res) => {
	try {
		const PrimaryTopicData = await PrimaryTopic.findOne({ _id: req.params.PrimaryTopicId });
		if (PrimaryTopicData.length != 0) {
			message = {
				error: false,
				message: "PrimaryTopic Data Found!",
				data: PrimaryTopicData,
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
			message: "PrimaryTopic not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

PrimaryTopicRoute.patch("/update/:PrimaryTopicId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await PrimaryTopic.updateOne({ _id: req.params.PrimaryTopicId }, req.body);
		message = {
			error: false,
			message: "PrimaryTopic Updated Successfully!"
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

PrimaryTopicRoute.delete("/delete/:PrimaryTopicId", isAuthenticate, async (req, res) => {
	try {
		const result = await PrimaryTopic.deleteOne({ _id: req.params.PrimaryTopicId });
		if (result.deletedCount == 1) {
			message = {
				error: false,
				message: "PrimaryTopic deleted successfully!",
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Operation failed!",
			};
			res.status(200).send(message);
		}
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: err,
		};
		res.status(200).send(message);
	}
});


module.exports = PrimaryTopicRoute;
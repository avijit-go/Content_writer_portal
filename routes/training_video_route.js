const express = require("express");
const TrainingVideo = require("../models/training_video");
const TrainingVideoRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");


TrainingVideoRoute.get("/list", async (req, res) => {
    try {
        const TrainingVideoList = await TrainingVideo.find({});
        message = {
            error: false,
            message: "TrainingVideo list",
            data: TrainingVideoList,
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

TrainingVideoRoute.post("/create", async (req, res) => {
	try {
        const TrainingVideoData = new TrainingVideo(req.body);
        const result = await TrainingVideoData.save();
        message = {
            error: false,
            message: "TrainingVideo Added Successfully!",
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

TrainingVideoRoute.get("/detail/:TrainingVideoId", async (req, res) => {
	try {
		const TrainingVideoData = await TrainingVideo.findOne({ _id: req.params.TrainingVideoId });
		if (TrainingVideoData.length != 0) {
			message = {
				error: false,
				message: "TrainingVideo Data Found!",
				data: TrainingVideoData,
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
			message: "TrainingVideo not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

TrainingVideoRoute.patch("/update/:TrainingVideoId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await TrainingVideo.updateOne({ _id: req.params.TrainingVideoId }, req.body);
		message = {
			error: false,
			message: "TrainingVideo Updated Successfully!"
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

TrainingVideoRoute.delete("/delete/:TrainingVideoId", isAuthenticate, async (req, res) => {
	try {
		const result = await TrainingVideo.deleteOne({ _id: req.params.TrainingVideoId });
		if (result.deletedCount == 1) {
			message = {
				error: false,
				message: "TrainingVideo deleted successfully!",
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

TrainingVideoRoute.get("/search", async (req, res) => {
	try {
		let TrainingVideoData = [];
        if (req.query.q) {
            TrainingVideoData = await TrainingVideo.find({ name: { $regex:req.query.q, $options: 'i' } });
        }
        // if (req.query.mobile) {
        //     TrainingVideoData = await TrainingVideo.find({phone: req.query.mobile});
        // }
		if (TrainingVideoData.length != 0) {
			message = {
				error: false,
				message: "Training Video Data Found!",
				data: TrainingVideoData,
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
			message: "Training Video not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

module.exports = TrainingVideoRoute;
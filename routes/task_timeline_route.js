const express = require("express");
const TaskTimeline = require("../models/task_timeline");
const TaskTimelineRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");


TaskTimelineRoute.post("/create", isAuthenticate, async (req, res) => {
	try {
        const TaskTimelineData = new TaskTimeline(req.body);
        const result = await TaskTimelineData.save();
        message = {
            error: false,
            message: "TaskTimeline Added Successfully!",
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

TaskTimelineRoute.get("/list/:taskId", isAuthenticate, async (req, res) => {
	try {
		const TaskTimelineData = await TaskTimeline.find({task: req.params.taskId}).populate(
            [
                {
                    path: "task",
                    select: "name"
                }
            ]
        );
		if (TaskTimelineData.length != 0) {
			message = {
				error: false,
				message: "TaskTimeline Data Found!",
				data: TaskTimelineData,
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
			message: "Operation failed!",
			data: err,
		};
		res.status(200).send(message);
	}
});

module.exports = TaskTimelineRoute;

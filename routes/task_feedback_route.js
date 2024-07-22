const express = require("express");
const TaskFeedback = require("../models/task_feedback");
const TaskFeedbackRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");


TaskFeedbackRoute.post("/create", isAuthenticate, async (req, res) => {
	try {
        const TaskFeedbackData = new TaskFeedback(req.body);
        const result = await TaskFeedbackData.save();
        message = {
            error: false,
            message: "TaskFeedback Added Successfully!",
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

TaskFeedbackRoute.get("/list", isAuthenticate, async (req, res) => {
	try {
		const TaskFeedbackData = await TaskFeedback.find({}).populate(
            [
                {
                    path: "task",
                    select: "name"
                },
                {
                    path: "teamMember",
                    select: "firstName lastName designation",
                    populate: {
                        path: "designation",
                        select: "-_id name"
                    }
                }
            ]
        );
		if (TaskFeedbackData.length != 0) {
			message = {
				error: false,
				message: "TaskFeedback Data Found!",
				data: TaskFeedbackData,
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

TaskFeedbackRoute.get("/list/:taskId", isAuthenticate, async (req, res) => {
	try {
		const TaskFeedbackData = await TaskFeedback.find({task: req.params.taskId}).populate(
            [
                {
                    path: "task",
                    select: "name"
                },
                {
                    path: "teamMember",
                    select: "firstName lastName designation",
                    populate: {
                        path: "designation",
                        select: "-_id name"
                    }
                }
            ]
        );
		if (TaskFeedbackData.length != 0) {
			message = {
				error: false,
				message: "TaskFeedback Data Found!",
				data: TaskFeedbackData,
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

TaskFeedbackRoute.patch("/update/:TaskFeedbackId", isAuthenticate, async (req, res) => {
	try {
		const result = await TaskFeedback.updateOne({ _id: req.params.TaskFeedbackId }, req.body);
		message = {
			error: false,
			message: "TaskFeedback Updated Successfully!"
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

module.exports = TaskFeedbackRoute;

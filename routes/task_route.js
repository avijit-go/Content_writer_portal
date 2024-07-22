const express = require("express");
const Task = require("../models/task");
const TeamMember = require("../models/team_member");
const TaskRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");
const Project = require("../models/project");


TaskRoute.post("/create", async (req, res) => {
	try {
        const TaskData = new Task(req.body);
        const result = await TaskData.save();
        message = {
            error: false,
            message: "Task Added Successfully!",
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

TaskRoute.get("/list", async (req, res) => {
	try {
		const TaskData = await Task.find({}).populate([
			{
				path: "project",
				select: "name"
			},
			{
				path: "client",
				select: "name"
			},
			{
				path: "writer",
				select: "firstName lastName"
			},
			{
				path: "editor",
				select: "firstName lastName"
			},
			{
				path: "projectManager",
				select: "firstName lastName"
			},
		]).select("-contentDetail");
		if (TaskData.length != 0) {
			message = {
				error: false,
				message: "Task Data Found!",
				data: TaskData,
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
			message: "Task not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

TaskRoute.get("/list-by-member/:TeamMemberId", async (req, res) => {
	try {
		const TeamMemberData = await TeamMember.findOne({ _id: req.params.TeamMemberId }).populate(["designation", "reportingTo"]);
		let TaskData;
		if (TeamMemberData.designation.name !== 'Team Lead') {
			TaskData = await Task.find({$or: [{ writer: req.params.TeamMemberId }, { editor: req.params.TeamMemberId }, { projectManager: req.params.TeamMemberId }]}).populate([
				{
					path: "project",
					select: "name"
				},
				{
					path: "client",
					select: "name"
				},
				{
					path: "writer",
					select: 'firstName lastName email phone gender'
				},
				{
					path: "editor",
					select: 'firstName lastName email phone gender'
				},
				{
					path: "projectManager",
					select: 'firstName lastName email phone gender'
				}
			]).select("-contentDetail");
		} else {
			TaskData = await Task.find({}).populate([
				{
					path: "project",
					select: "name"
				},
				{
					path: "client",
					select: "name"
				},
				{
					path: "writer",
					select: 'firstName lastName email phone gender'
				},
				{
					path: "editor",
					select: 'firstName lastName email phone gender'
				},
				{
					path: "projectManager",
					select: 'firstName lastName email phone gender'
				}
			]).select("-contentDetail");
		}
		if (TaskData.length != 0) {
			message = {
				error: false,
				message: "Task Data Found!",
				data: TaskData,
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
			message: "Task not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

TaskRoute.get("/list-by-client/:clientId", async (req, res) => {
	try {
		const TaskData = await Task.find({ client: req.params.clientId }).populate([
			{
				path: "project",
				select: "name"
			},
			{
				path: "client",
				select: "name"
			},
            {
                path: "writer",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "editor",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "projectManager",
                select: 'firstName lastName email phone gender'
            }
        ]).select("-contentDetail");
		if (TaskData.length != 0) {
			message = {
				error: false,
				message: "Task Data Found!",
				data: TaskData,
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
			message: "Task not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

TaskRoute.get("/detail/:TaskId", async (req, res) => {
	try {
		const TaskData = await Task.findOne({ _id: req.params.TaskId }).populate([
			{
				path: "contentType",
			},
			{
				path: "primaryTopic",
			},
			{
				path: "project",
				select: "name"
			},
			{
				path: "client",
				select: "name"
			},
            {
                path: "writer",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "editor",
                select: 'firstName lastName email phone gender'
            },
            {
                path: "projectManager",
                select: 'firstName lastName email phone gender'
            }
        ]);
		if (TaskData.length != 0) {
			message = {
				error: false,
				message: "Task Data Found!",
				data: TaskData,
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
			message: "Task not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

TaskRoute.patch("/update/:TaskId", isAuthenticate, async (req, res) => {
	try {
		delete req.body.content;
		delete req.body.completed;
		delete req.body.approved;
		const result = await Task.updateOne({ _id: req.params.TaskId }, req.body);
		message = {
			error: false,
			message: "Task Updated Successfully!"
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

TaskRoute.patch("/content-submit/:TaskId", isAuthenticate, async (req, res) => {
	try {
		const result = await Task.updateOne({ _id: req.params.TaskId }, {contentDetail: req.body.contentDetail});
		message = {
			error: false,
			message: "Task submitted Successfully!"
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

TaskRoute.patch("/submission-status/:TaskId", isAuthenticate, async (req, res) => {
	try {
		const result = await Task.updateOne({ _id: req.params.TaskId }, {submitted: req.body.submitted, submittedAt: Date.now()});
		message = {
			error: false,
			message: "Task submitted Successfully!"
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

TaskRoute.patch("/completed/:TaskId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await Task.updateOne({ _id: req.params.TaskId }, {completed:req.body.completed});
		message = {
			error: false,
			message: "Task completed!"
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

TaskRoute.patch("/approval/:TaskId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await Task.updateOne({ _id: req.params.TaskId }, {approved:req.body.approved, approvedAt: Date.now()});
		message = {
			error: false,
			message: "Task approval change Successfully!"
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

TaskRoute.patch("/toggle-status/:TaskId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await Task.updateOne({ _id: req.params.TaskId }, {status:req.body.status});
		message = {
			error: false,
			message: "Task status Updated Successfully!"
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

TaskRoute.patch("/add-time/:TaskId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await Task.updateOne({ _id: req.params.TaskId }, { $inc: { totalTimeTaken: req.body.time } });
		message = {
			error: false,
			message: "Task time Updated Successfully!"
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

TaskRoute.delete("/delete/:TaskId", isAuthenticate, async (req, res) => {
	try {
		const result = await Task.deleteOne({ _id: req.params.TaskId });
		if (result.deletedCount == 1) {
			message = {
				error: false,
				message: "Task deleted successfully!",
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

TaskRoute.get("/search", async (req, res) => {
	try {
		let TaskData = [];
		let userType = req.query.userType;
		let userId = req.query.uid;
		let dueRange = req.query.dueRange;
		let populate =  [
			{
				path: "project",
				select: "name"
			},
			{
				path: "client",
				select: "name"
			},
			{
				path: "writer",
				select: "firstName lastName"
			},
			{
				path: "editor",
				select: "firstName lastName"
			},
			{
				path: "projectManager",
				select: "firstName lastName"
			},
		];
        if (req.query.q && !userType && !userId) {
            TaskData = await Task.find({ title: { $regex:req.query.q, $options: 'i' } }).populate(populate).select("-contentDetail");
        }
		if (userType && userId) {

			populate.forEach((element, index) => {
				if (element.path === userType) {
					populate[index].match = {_id: userId}
				}
			});

			TaskData = await Task.find({ title: { $regex:req.query.q, $options: 'i' } }).populate(populate).select("-contentDetail");

			TaskData = TaskData.filter( e => (e.client !== null) && (e.writer !== null) && (e.editor !== null) && (e.projectManager !== null));
		}
		if (dueRange) {
			var start = new Date();
			var end = new Date();
			switch (dueRange) {
				case "today":
					start.setDate(start.getDate()-1)
					// end.setDate(end.getDate()+1);
					break;
				case "week":
					end.setDate(end.getDate()+6);
					break;
				case "month":
					end.setDate(end.getDate()+29);
					break;
			
				default:
					end.setDate(end.getDate()+9999);
					break;
			}
			TaskData = await Task.find({ dueDate: 
				{
					$gte: start.toISOString(), 
					$lt: end.toISOString()
				}
			}).populate(populate).select("-contentDetail");
		}
		if (TaskData.length != 0) {
			message = "Task Data Found!";
		} else {
			message = "No Data Found!";
		}
		response = {
			error: false,
			message: message,
			data: TaskData,
		};
		res.status(200).send(response);
	} catch (err) {
		message = {
			error: true,
			message: "Operation failed!",
			data: err,
		};
		res.status(200).send(message);
	}
});

TaskRoute.get("/dashboard", async (req, res) => {
	try {
		let TaskData;
		let projectData;
		let userType = req.query.userType;
		let userId = req.query.uid;
		let populate =  [
			{
				path: "project",
				select: "name"
			},
			{
				path: "client",
				select: "name"
			},
			{
				path: "writer",
				select: "firstName lastName"
			},
			{
				path: "editor",
				select: "firstName lastName"
			},
			{
				path: "projectManager",
				select: "firstName lastName"
			},
		];
		if (userType && userId) {
			populate.forEach((element, index) => {
				if (element.path === userType) {
					populate[index].match = {_id: userId}
				}
			});
			TaskData = await Task.find({}).populate(populate).select("-contentDetail");
			TaskData = TaskData.filter( e => (e.client !== null) && (e.writer !== null) && (e.editor !== null) && (e.projectManager !== null));
		} else {
			TaskData = await Task.find({}).populate(populate).select("-contentDetail");
			let totalProject = await Project.find({}).count();
			let completedProject = await Project.find({completed: true}).count();
			let activeProject = await Project.find({status: true}).count();
			projectData = {
				totalProject,
				completedProject,
				activeProject
			}
		}
		let currentDate = new Date();
		currentDate = currentDate.toISOString();

		if (TaskData.length != 0) {
			let overDue = TaskData.filter( e => (e.dueDate.toISOString() < currentDate) && (e.completed !== true));
			let upcoming = TaskData.filter( e => (e.startDate.toISOString() > currentDate) && (e.completed !== true));
			let submitted = TaskData.filter( e => e.submitted === true);
			let completed = TaskData.filter( e => e.completed === true);
			let approved = TaskData.filter( e => e.approved === true);
			message = {
				error: false,
				message: "Task Dashboard Data!",
				data: {
					totalTask: {
						count: TaskData.length,
						data: TaskData
					},
					overDue: {
						count: overDue.length,
						data: overDue
					},
					upcoming: {
						count: upcoming.length,
						data: upcoming
					},
					submitted: {
						count: submitted.length,
						data: submitted
					},
					completed: {
						count: completed.length,
						data: completed
					},
					approved: {
						count: approved.length,
						data: approved
					},
					projectData
				},
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

module.exports = TaskRoute;
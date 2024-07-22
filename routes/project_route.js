const express = require("express");
const Project = require("../models/project");
const ProjectRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");


ProjectRoute.get("/list", async (req, res) => {
    try {
        const ProjectList = await Project.find({}).populate("client");
        message = {
            error: false,
            message: "Project list",
            data: ProjectList,
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

ProjectRoute.get("/list-by-client/:clientId", async (req, res) => {
    try {
        const ProjectList = await Project.find({client: req.params.clientId}).populate("client");
        message = {
            error: false,
            message: "Project list",
            data: ProjectList,
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

ProjectRoute.post("/create", async (req, res) => {
	try {
        const ProjectData = new Project(req.body);
        const result = await ProjectData.save();
        message = {
            error: false,
            message: "Project Added Successfully!",
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

ProjectRoute.get("/detail/:ProjectId", async (req, res) => {
	try {
		const ProjectData = await Project.findOne({ _id: req.params.ProjectId }).populate("client");
		if (ProjectData.length != 0) {
			message = {
				error: false,
				message: "Project Data Found!",
				data: ProjectData,
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
			message: "Project not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

ProjectRoute.patch("/update/:ProjectId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await Project.updateOne({ _id: req.params.ProjectId }, req.body);
		message = {
			error: false,
			message: "Project Updated Successfully!"
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

ProjectRoute.patch("/complete/:ProjectId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await Project.updateOne({ _id: req.params.ProjectId }, {completed: req.body.completed});
		message = {
			error: false,
			message: "Project Completion status cahnge!"
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

ProjectRoute.delete("/delete/:ProjectId", isAuthenticate, async (req, res) => {
	try {
		const result = await Project.deleteOne({ _id: req.params.ProjectId });
		if (result.deletedCount == 1) {
			message = {
				error: false,
				message: "Project deleted successfully!",
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

ProjectRoute.get("/search", async (req, res) => {
	try {
		let ProjectData = [];
        if (req.query.q) {
            ProjectData = await Project.find({ name: { $regex:req.query.q, $options: 'i' } }).populate("client");
        }
		if (req.query.client) {
            ProjectData = await Project.find()
			.populate([
				{
					path: "client", 
					match: {
						$or:[ 
							{name: { $regex:req.query.client, $options: 'i' }} 
						]
					}
				}
			]);
			ProjectData = ProjectData.filter( (e) => e.client !== null );
        }
		if (ProjectData.length != 0) {
			message = {
				error: false,
				message: "Client Data Found!",
				data: ProjectData,
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
			message: "Client not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

module.exports = ProjectRoute;
const express = require("express");
const ProjectProgress = require("../models/project_progress");
const ProjectProgressRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");


ProjectProgressRoute.get("/list", async (req, res) => {
    try {
        const ProjectProgressList = await ProjectProgress.find({}).populate("project");
        message = {
            error: false,
            message: "ProjectProgress list",
            data: ProjectProgressList,
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

ProjectProgressRoute.post("/create", async (req, res) => {
	try {
        const ProjectProgressData = new ProjectProgress(req.body);
        const result = await ProjectProgressData.save();
        message = {
            error: false,
            message: "ProjectProgress Added Successfully!",
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

ProjectProgressRoute.get("/detail/:ProjectProgressId", async (req, res) => {
	try {
		const ProjectProgressData = await ProjectProgress.findOne({ _id: req.params.ProjectProgressId }).populate("project");
		if (ProjectProgressData.length != 0) {
			message = {
				error: false,
				message: "ProjectProgress Data Found!",
				data: ProjectProgressData,
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
			message: "ProjectProgress not found!",
			data: err,
		};
		res.status(200).send(message);
	}
});

ProjectProgressRoute.patch("/update/:ProjectProgressId", isAuthenticate, async (req, res) => {
	try {
 
		const result = await ProjectProgress.updateOne({ _id: req.params.ProjectProgressId }, req.body);
		message = {
			error: false,
			message: "ProjectProgress Updated Successfully!"
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

ProjectProgressRoute.delete("/delete/:ProjectProgressId", isAuthenticate, async (req, res) => {
	try {
		const result = await ProjectProgress.deleteOne({ _id: req.params.ProjectProgressId });
		if (result.deletedCount == 1) {
			message = {
				error: false,
				message: "ProjectProgress deleted successfully!",
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


module.exports = ProjectProgressRoute;